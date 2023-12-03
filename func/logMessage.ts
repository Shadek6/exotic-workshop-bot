import { GuildTextBasedChannel, EmbedBuilder } from "discord.js";
import { client } from "../index";
export async function logMessage(MessageType: number, UserName: string, UserAction: string, MessageContent: string, UserID?: string) {
    const LOG_CHANNEL = client.channels.cache.get(process.env.LOG_CHANNEL!) as GuildTextBasedChannel;

    // 0 = Success 1 = Warning 2 = Error 3 = Info
    const LOG_EMBED = new EmbedBuilder();

    switch (MessageType) {
        case 0: {
            LOG_EMBED.setTitle("Success").setColor("Green");
            break;
        }

        case 1: {
            LOG_EMBED.setTitle("Warning").setColor("Orange");
            break;
        }

        case 2: {
            LOG_EMBED.setTitle("Error").setColor("Red");
            break;
        }

        case 3: {
            LOG_EMBED.setTitle("Info").setColor("Blue");
            break;
        }
    }

    LOG_EMBED.addFields({ name: "**User**", value: UserName, inline: true });
    LOG_EMBED.addFields({ name: "**Action**", value: UserAction, inline: true });
    LOG_EMBED.addFields({ name: "**Description**", value: MessageContent, inline: false });

    UserID ? LOG_CHANNEL.send({ content: `<@!${UserID}>`, embeds: [LOG_EMBED] }) : LOG_CHANNEL.send({ embeds: [LOG_EMBED] });
    return;
}
