import * as Discord from 'discord.js';
import { TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import * as utils from './utils';

import fs from 'fs';
import SpotifyWebApi from 'spotify-web-api-node';
import AutoPoster from 'topgg-autoposter';

import { DataProvidingService } from './data-providing-service';
import { UsersService } from './users-service';

import { returnUserFriendlyErrorMessage } from './error-handling';
import { DatabaseService } from './database-service';
import { handleButtonInteraction as handleButtonInteractionRegister } from './commands/register';
import { handleButtonInteraction as handleButtonInteractionUnregister } from './commands/unregister';

console.log('Configuring environment variables...')
dotenv.config();


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessageReactions,
		Discord.GatewayIntentBits.MessageContent,
    ],
    partials: [Discord.Partials.Message],
});
const dataProvidingService = new DataProvidingService();
const databaseService = new DatabaseService();
const usersService = new UsersService(databaseService);

const commands = new Discord.Collection<string, any>();
const commandsFolder = __dirname + '/commands';
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`${commandsFolder}/${file}`);
	commands.set(command.data.name, command);
}


client.once('ready', async () => {
    client.user.setPresence({
       activities: [{
           name: `${process.env.DISCORD_LISTENING_TO}`,
           type: Discord.ActivityType.Listening,
       }]
    });
    console.log(`Bot ready. Connected to Discord as ${client.user.tag}.`);

    // Uncomment below to register commands (might update later)

    // const commandsData = [...commands.values()].map((c) => c.data);
    //
    // const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    //
    // try {
	// 	console.log(`Started refreshing ${commands.size} application (/) commands.`);
    //
	// 	// The put method is used to fully refresh all commands in the guild with the current set
	// 	const data = await rest.put(
	// 		Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
	// 		{ body: commandsData },
	// 	);
    //
	// 	console.log(`Successfully reloaded application (/) commands.\n${data}`);
	// } catch (error) {
	// 	// And of course, make sure you catch and log any errors!
	// 	console.error(error);
	// }
});

client.on('messageCreate', async (message) => {
    if (message.channel instanceof Discord.TextChannel && message.author.bot) {
        const playbackData = dataProvidingService.lookForPlaybackData(message);
        if (playbackData) {
            const track = await utils.parseTrack(playbackData, spotifyApi);
            await usersService.addToScrobbleQueue(track, playbackData, message.channel);
        }
    }
});

client.on('interactionCreate', async (interaction)=> {
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);

        if (!command) {
            interaction.reply(`I didn't recognize this command. You can see all the available commands by sending \`${process.env.DISCORD_BOT_PREFIX}help\`.`);
            return;
        }

        try {
            await command.execute(interaction, usersService, client);
        } catch (error) {
            await returnUserFriendlyErrorMessage(error, interaction, usersService, client);
        }

        // TODO: See registered users for a given guild
    } else if (interaction.isButton()) {
        if (interaction.customId.startsWith('register')) {
            await handleButtonInteractionRegister(interaction, usersService, client);
        } else if (interaction.customId.startsWith('unregister')) {
            await handleButtonInteractionUnregister(interaction, usersService, client);
        }
    }
});

client.on('guildCreate', async (guild: Discord.Guild) => {
    let channel = guild.channels.cache.find(channel =>
        channel.type === Discord.ChannelType.GuildText &&
        channel.permissionsFor(guild.members.me).has([Discord.PermissionsBitField.Flags.SendMessages])
    );

    if (channel == null || !(channel instanceof Discord.TextChannel)) {
        return;
    }

    const welcomeMessage = await utils.composeGuildWelcomeMessageEmbed();
    channel.send({ embeds: [welcomeMessage] });
});

async function checkControllerUpdate(channelId: string, messageId: string) {
    const channel = await client.channels.fetch(channelId);
    // @ts-ignore
    const fullMessage = await channel.messages!.fetch(messageId);
    return fullMessage;
}

client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.embeds?.[0]?.description !== newMessage.embeds?.[0]?.description
            && newMessage.embeds?.[0]?.author?.name === 'Now playing') {
        const fullMessage = await checkControllerUpdate(newMessage.channel?.id, newMessage.id);

        const playbackData = dataProvidingService.lookForPlaybackData(fullMessage);
        if (playbackData) {
            const track = await utils.parseTrack(playbackData, spotifyApi);
            await usersService.addToScrobbleQueue(track, playbackData, fullMessage.channel as TextChannel);
        }
    }
});

console.log('Retrieving data from database...');
usersService.retrieveAllRegisteredUsersFromDatabase().then(() => {
    console.log('Connecting to Discord...');
    client.login(process.env.DISCORD_TOKEN);

    if (process.env.NODE_ENV === 'production' && process.env.TOPGG_TOKEN && process.env.TOPGG_TOKEN !== '') {
        AutoPoster(process.env.TOPGG_TOKEN, client);
        console.log('Top.gg AutoPoster enabled');
    } else {
        console.log('Top.gg AutoPoster disabled');
    }
})
