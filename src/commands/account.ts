import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { UsersService } from '../users-service';
import { composeBasicMessageEmbed } from '../utils';

export const data = new SlashCommandBuilder()
    .setName('account')
    .setDescription('View your registration details and preferences.');

export async function execute(interaction: ChatInputCommandInteraction, usersService: UsersService, client: Client) {
    const registeredUser = usersService.getRegisteredUser(interaction.user);
    const messageText = `**Last.fm connected account**
[${registeredUser.lastfmUserName}](https://last.fm/user/${registeredUser.lastfmUserName})

**Scrobbling**
${registeredUser.isScrobbleOn ? '🟢 Enabled' : '🔴 Disabled'}
When this option is enabled, Cordscrobbler will scrobble songs played to your Last.fm account. To turn it ${!registeredUser.isScrobbleOn ? 'on' : 'off'}, send \`\\scrobbling ${!registeredUser.isScrobbleOn ? 'on' : 'off'}\`.

**Receive news and updates from Cordscrobbler**
${registeredUser.sendNewsMessages ? '🟢 Enabled' : '🔴 Disabled'}
When this option is enabled, I will send news about Cordscrobbler updates, new features and so on. To turn it ${!registeredUser.sendNewsMessages ? 'on' : 'off'}, send \`\\news ${!registeredUser.sendNewsMessages ? 'on' : 'off'}\`.
`

    const messageEmbed = await composeBasicMessageEmbed('Registration details', messageText)

    interaction.reply({ embeds: [messageEmbed], ephemeral: true });
}