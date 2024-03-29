import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { UsersService } from '../users-service';
import { returnExpectedCommandUsage } from '../error-handling';

export const data = new SlashCommandBuilder()
    .setName('news')
    .setDescription('Toggle the option to receive news occasionally about Cordscrobbler updates and new features.')
    .addStringOption(
        (opt) => opt
            .setName('toggle')
            .setDescription('<on>|<off>')
            .setRequired(true)
            .addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' },
            )
    );

export async function execute(interaction: ChatInputCommandInteraction, usersService: UsersService, client: Client) {
    if (interaction.options.getString('toggle') === 'on') {
        usersService.toggleNewsMessagesSendingForUser(interaction.user, true);
        interaction.reply({ content: 'From now on, I **will send** news about Cordscrobbler updates and new features.', ephemeral: true });
    } else if (interaction.options.getString('toggle') === 'off') {
        usersService.toggleNewsMessagesSendingForUser(interaction.user, false);
        interaction.reply({ content: 'From now on, I **will not send** news about Cordscrobbler updates and new features.', ephemeral: true });
    } else {
        returnExpectedCommandUsage(data.name, '<on>|<off>', interaction);
    }
}
