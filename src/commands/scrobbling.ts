import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { UsersService } from '../users-service';
import { returnExpectedCommandUsage } from '../error-handling';

export const data = new SlashCommandBuilder()
    .setName('scrobbling')
    .setDescription('Toggle the scrobbling for your account.')
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
        usersService.toggleScrobblingForUser(interaction.user, true);
        interaction.reply({ content: 'I turned **on** your scrobbles.', ephemeral: true });
    } else if (interaction.options.getString('toggle') === 'off') {
        usersService.toggleScrobblingForUser(interaction.user, false);
        interaction.reply({ content: 'I turned **off** your scrobbles.', ephemeral: true });
    } else {
        returnExpectedCommandUsage(data.name, '<on|off>', interaction);
    }
}