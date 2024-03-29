import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { allDataProviders } from '../data-providing-service';
import { UsersService } from '../users-service';
import { composeBasicMessageEmbed } from '../utils';

export const data = new SlashCommandBuilder()
    .setName('supportedbots')
    .setDescription('View supported bots and additional configuration help.');

export async function execute(interaction: ChatInputCommandInteraction, usersService: UsersService, client: Client) {

    let messageText = '';

    for (const dataProvider of allDataProviders) {
        messageText += `\n\n**${dataProvider.providerName}**\n${dataProvider.providerAdditionalInfo}`;
    }

    let messageEmbed = await composeBasicMessageEmbed('Supported bots', messageText);

    await interaction.reply({ embeds:[messageEmbed], ephemeral: true });
}
