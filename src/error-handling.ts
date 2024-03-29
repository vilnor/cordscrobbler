import { ButtonInteraction, ChatInputCommandInteraction, Client } from 'discord.js';
import { UsersService } from './users-service';

export async function returnUserFriendlyErrorMessage(error: Error, interaction: ChatInputCommandInteraction | ButtonInteraction, usersService: UsersService, client: Client) {
    switch (error.message) {
        case 'LastfmServiceUnavailable':
            await interaction.reply({
                content: `Sorry, seems like the Last.fm service is unavailable. Please try again later :/`,
                ephemeral: true
            });
            break;
        case 'LastfmTokenNotAuthorized':
            await interaction.reply({
                content: `Sorry, something went wrong while trying to log in to Last.fm. Please try again sending \`register\`. Remember you need to enter the provided link, log in with your account and select *Yes, allow access*.`,
                ephemeral: true
            });
            break;
        case 'LastfmRequestUnknownError':
            await interaction.reply({
                content: `It looks like something went wrong with Last.fm. Sorry :/`,
                ephemeral: true
            });
            break;
        case 'UserAlreadyRegistered':
            await interaction.reply({
                content: `Seems like you're already registered :D\nYou can view your account details by sending \`account\`.`,
                ephemeral: true
            });
            break;
        case 'UserNotRegistered':
            await interaction.reply({
                content: `Seems like you are not registered. To start the registration process, please send \`register\`.`,
                ephemeral: true
            });
            break;
        case 'UserAlreadyInRegistrationProcess':
            await interaction.reply({
                content: `You already are in a registration process. Follow the steps in previous messages to proceed with login. If you're encountering issues during registration, sending \`unregister\` to clear your data might help.`,
                ephemeral: true
            });
            break;
        case 'UserNotInRegistrationProcess':
            await interaction.reply({
                content: `You are not in registration process. To start it, please send \`register\`.`,
                ephemeral: true
            });
            break;
        default:
            console.error(error);
            await interaction.reply({
                content: `An error happened and I don't know why. Sorry :/`,
                ephemeral: true
            });
            break;
    }
}

export async function returnExpectedCommandUsage(commandName: string, usage: string, interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        content: `I didn't understand your command. Make sure you send it in the format: \`${commandName + ' ' + usage}\`.`,
        ephemeral: true,
    });
}