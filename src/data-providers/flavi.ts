import { DataProvider, PlaybackData } from '../data-providing-service';
import { Message } from 'discord.js';

export class FlaviDataProvider implements DataProvider {
    readonly providerName = 'FlaviBot';
    readonly providerAdditionalInfo = 'Listens for updates to the FlaviBot controller message.';

    isHandleableMessage(message: Message): boolean {
        return (message?.author?.bot && message.embeds?.[0]?.author?.name === 'Now playing')
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
