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

import { returnUserFriendlyErrorMessage } from '../error-handling';
import { composeBasicMessageEmbed } from '../utils';

export const data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Connect your Last.fm account with this bot.');

export async function handleButtonInteraction(interaction: ButtonInteraction, usersService: UsersService, client: Client) {
    if (interaction.customId === 'register-connected') {
        try {
            const registeredUser = await usersService.completeRegistrationProcess(
                interaction.user
            );
            let title = 'Registration completed';
            let description = `Your Last.fm login is **${registeredUser.lastfmUserName}**.
            
You can review your settings (for example, if you wish to temporarily disable scrobbles) by using \`account\`.
            `;
            let footer = 'Happy listening! Scrobbles have been enabled for you :)';
            const registrationEmbed = await composeBasicMessageEmbed(title, description, footer);

            await interaction.update({ embeds: [registrationEmbed], components: [] });
        } catch (error) {
            returnUserFriendlyErrorMessage(
                error,
                interaction,
                usersService,
                client
            );
            usersService.cancelRegistrationProcess(interaction.user);
        }
    } else if (interaction.customId === 'register-cancel') {
        usersService.cancelRegistrationProcess(interaction.user);
        await interaction.update({ content: `I canceled your registration process. You can use \`register\` to try again.`, embeds: [], components: [] })
    }
}

export async function execute(interaction: ChatInputCommandInteraction, usersService: UsersService, client: Client) {
    await usersService.startRegistrationProcess(interaction.user);

    const lastfmRegistrationURL = usersService.getRegistrationProcessLoginUrl(
        interaction.user
    );
    const title =  'Connect your Last.fm account';
    const description = `Please [proceed to Last.fm application connect page](${lastfmRegistrationURL}) and follow the steps on your browser.

If the link isn't working, try copying the URL: ${lastfmRegistrationURL}

**After you connect your account, click the \`Connected\` button to proceed.**`;

    const registrationEmbed = await composeBasicMessageEmbed(title, description);

    const connectedButton = new ButtonBuilder()
        .setCustomId('register-connected')
        .setLabel('Connected')
        .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
        .setCustomId('register-cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRowBuilder()
        .addComponents(cancelButton, connectedButton);

    // @ts-ignore
    await interaction.reply({ embeds: [registrationEmbed], components: [buttonRow], ephemeral: true });

    // cancel in 10min
    setTimeout(() => {
        usersService.cancelRegistrationProcess(interaction.user);
        interaction.editReply({ content: `Your registration process has expired. You can try again using \`register\`.`, embeds: [], components: [] })
    }, 600000);
}