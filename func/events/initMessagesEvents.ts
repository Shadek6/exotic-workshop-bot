import { Events, Message, PartialMessage } from "discord.js";
import { client } from "../..";
import { logMessage } from "../logMessage";

export function initMessagesEvents() {
    client.on(Events.MessageDelete, async (message: Message | PartialMessage ) => {
        logMessage(3, message.author!.username, "Message Delete", `**Message by _\`${message.author?.username}\`_ got deleted in <#${message.channel.id}>**\n\n\`${message.content}\``, message.author!.id);
    })

    client.on(Events.MessageUpdate, async (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
        logMessage(3, newMessage.author!.username, "Message Update", `**Message by _\`${newMessage.author?.username}\`_ got updated in <#${newMessage.channel.id}>**\n\n\n**Old message:**\n\n\`${oldMessage.content}\`\n\n\n**New message:**\n\n\`${newMessage.content}\``, newMessage.author!.id);
    })
}