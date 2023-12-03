import { Message } from "discord.js";
import { client } from "../../index";
import { logMessage } from "../logMessage";

export function linkBlock() {
    client.on("messageCreate", async (message: Message) => {
        const MESSAGE_AUTHOR = await message.guild!.members.fetch(message.author.id)

        if (MESSAGE_AUTHOR.roles.cache.has("1178743051582189609") || MESSAGE_AUTHOR.roles.cache.has("1180256831097016330") || MESSAGE_AUTHOR.roles.cache.has("1180256928186761327")) return

        if (message.content.includes("http") && message.content.includes("discord")) {
            logMessage(
                3,
                message.author.username,
                "Message Delete",
                `Wiadomość o treści \`${message.content}\` została usunięta z kanału <#${message.channel.id}>`,
                message.author.id
            );
            await message.delete().then(() => {
                message.channel.send(`<@!${message.author.id}>, nie możesz wysyłać takich linków!`).then((botMessage) => {
                    setTimeout(() => {
                        botMessage.delete();
                    }, 3000);
                });
            });
        }
    });
}
