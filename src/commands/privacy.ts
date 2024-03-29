import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { UsersService } from '../users-service';

export const data = new SlashCommandBuilder()
    .setName('privacy')
    .setDescription('View the privacy policy of this bot.');

export async function execute(interaction: ChatInputCommandInteraction, usersService: UsersService, client: Client) {
    interaction.reply({
        content: `Our privacy policy is available on https://github.com/Erick2280/cordscrobbler/tree/release/docs/PRIVACY_POLICY.md.`,
        ephemeral: true,
    });
}