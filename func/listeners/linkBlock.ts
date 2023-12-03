import { Message } from "discord.js";
import { client } from "../../index";

export function linkBlock() 
{
    client.on('messageCreate', async (message: Message) => {
        const MESSAGE_AUTHOR = await message.guild!.members.fetch(message.author.id)

        if (MESSAGE_AUTHOR.roles.cache.has("1178743051582189609") || MESSAGE_AUTHOR.roles.cache.has("1180256831097016330") || MESSAGE_AUTHOR.roles.cache.has("1180256928186761327")) return

        if(message.content.includes("http") && message.content.includes("discord")) 
        {
            await message.delete().then(() => {
                message.channel.send(`<@!${message.author.id}>, nie możesz wysyłać takich linków!`)
                .then((botMessage) => {
                    setTimeout(() => {
                        botMessage.delete()
                    }, 3000)
                })
            })
        }
    })
}