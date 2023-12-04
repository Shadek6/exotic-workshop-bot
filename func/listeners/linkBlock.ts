import { Message, TextBasedChannel } from "discord.js";
import { client } from "../../index";
import { logMessage } from "../logMessage";
export function linkBlock() {
    client.on("messageCreate", async (message: Message) => {
        const MESSAGE_AUTHOR = await message.guild!.members.fetch(message.author.id);

        // Check if the author has any of the specified roles
        const hasRole = ["1178743051582189609", "1180256831097016330", "1180256928186761327"].some((roleId) => MESSAGE_AUTHOR.roles.cache.has(roleId));
        if (hasRole) return;

        // Check if the message content includes a Discord server link
        if (message.content.includes("http") && message.content.includes("discord")) {
            const channel = message.channel as TextBasedChannel;

            // Log the deleted message
            logMessage(3, message.author.username, "Message Delete", `Wiadomość o treści \`${message.content}\` została usunięta z kanału <#${channel.id}>`, message.author.id);

            // Delete the message and send a warning message to the channel
            await message.delete();
            const warningMessage = await channel.send(`<@!${message.author.id}>, nie możesz wysyłać takich linków!`);

            // Delete the warning message after 3 seconds
            setTimeout(() => {
                warningMessage.delete();
            }, 3000);
        }
    });
}
