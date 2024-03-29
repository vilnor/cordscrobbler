import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { composeBasicMessageEmbed } from '../utils';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show user help.');

export async function execute(interaction: ChatInputCommandInteraction) {

    let messageText =
`**What is this bot?**

This bot scrobbles songs played by other bots on your Discord server to Last.fm. I will automatically scrobble if you are on the same audio channel as the bot, on any server that I'm added to.
To enable it for you, you'll need to use the \`register\` command and log in with your Last.fm account.

**Commands**\n`;
    const commandsFolder = __dirname;
    const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    
    for (const file of commandFiles) {
        const command = require(`${commandsFolder}/${file}`);
            messageText += `\n\`${command.data.name}\``;
            messageText += `\n• ${command.data.description}\n`;
    }

    const versionFooter = `Cordscrobbler v${process.env.NPM_PACKAGE_VERSION ?? require('../lib/version.js')}`

    const messageEmbed = await composeBasicMessageEmbed('Help', messageText, versionFooter)

    interaction.reply({ embeds:[messageEmbed] });
}