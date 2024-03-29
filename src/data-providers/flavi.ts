import { DataProvider, PlaybackData } from '../data-providing-service';
import { Message } from 'discord.js';

export class FlaviDataProvider implements DataProvider {
    readonly providerName = 'FlaviBot';
    readonly providerAdditionalInfo = 'FlaviBot yay';
    readonly possibleUsernames = ['FlaviBot']

    isHandleableMessage(message: Message): boolean {
        // @ts-ignore
        return ((this.possibleUsernames.includes(message?.author?.username) || message?.channel?.name === 'flavi-controller') && message.embeds?.[0]?.author?.name === 'Now playing')
    }

    getPlaybackDataFromMessage(message: Message): PlaybackData {
        const dataString = message?.embeds?.[0]?.description;
        const title = dataString?.slice(dataString?.indexOf('[') + 1, dataString?.lastIndexOf(']'));
        const url = dataString?.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)?.[0];

        return {
            title,
            url,
            guildId: message.guild.id,
            timestamp: new Date(),
            channelId: message.member.voice.channel.id,
            listeningUsersId: [...message.member.voice.channel.members.keys()],
            providerName: this.providerName,
        };
    }
}
