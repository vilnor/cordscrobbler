import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
} from 'discord.js';
import { UsersService } from '../users-service';

export const data = new SlashCommandBuilder()
    .setName('unregister')
    .setDescription('Delete your account and clear your data.');

export async function handleButtonInteraction(interaction: ButtonInteraction, usersService: UsersService, client: Client) {
    if (interaction.customId === 'unregister-yes') {
        await usersService.unregisterUser(interaction.user);
        await interaction.update({ content: `Your account was successfully deleted.`, components: [] });
    } else if (interaction.customId === 'unregister-no') {
        await interaction.update({ content: `Your account deletion was cancelled. No further action was taken.`, components: [] })
    }
}

export async function execute(interaction: ChatInputCommandInteraction, usersService: UsersService, client: Client) {
    if (usersService.isUserRegistered(interaction.user)) {
        const connectedButton = new ButtonBuilder()
            .setCustomId('unregister-yes')
            .setLabel('Yes')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('unregister-no')
            .setLabel('No')
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder()
            .addComponents(cancelButton, connectedButton);

        await interaction.reply({
            content: `Are you sure you want to delete your account? Please click **yes** to confirm within 2 minutes; otherwise click **no**.`,
            // @ts-ignore
            components: [buttonRow],
            ephemeral: true
        });

        // cancel in 2min
        setTimeout(() => {
            usersService.cancelRegistrationProcess(interaction.user);
            interaction.editReply({ content: `Your registration process has expired. You can try again using \`register\`.`, components: [] })
        }, 120000);
    } else if (usersService.isUserInRegistrationProcess(interaction.user)) {
        usersService.cancelRegistrationProcess(interaction.user);
        await interaction.reply({ content: `I canceled your registration process. You can use \`register\` to try again.`, ephemeral: true })
    } else {
        await interaction.reply({ content: `You don't seem to be registered. No further action was taken :)`, ephemeral: true })
    }
}