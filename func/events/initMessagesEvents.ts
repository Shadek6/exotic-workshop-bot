import { Events, Message, PartialMessage } from "discord.js";

import { client } from "../..";
import { logMessage } from "../logMessage";

export function initMessagesEvents() {
    client.on(Events.MessageDelete, async (message: Message | PartialMessage ) => {
        const isUserBot = message.author?.bot;
        if(isUserBot) return;

        try {
            await logMessage(3, message.author!.username, "Message Delete", `**Message by _\`${message.author?.username}\`_ got deleted in <#${message.channel.id}>**\n\`${message.content}\``);
        } catch (error) {
            console.log(error);
        }
    })

    client.on(Events.MessageUpdate, async (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
        const isUserBot = oldMessage.author?.bot || newMessage.author?.bot;
        if(isUserBot) return;
      
        try {
            await logMessage(3, newMessage.author!.username, "Message Update", `**Message by _\`${newMessage.author?.username}\`_ got updated in <#${newMessage.channel.id}>**\n\n**Old message:**\n\`${oldMessage.content}\`\n\n**New message:**\n\`${newMessage.content}\``);
        } catch (error) {
            console.log(error);
        }
    })
}