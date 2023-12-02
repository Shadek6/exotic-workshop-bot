import { GuildChannel, Interaction } from "discord.js";
import { client } from "../..";
import { createTuningTicket } from "../tickets/createTuningTicket";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initTicketClose() 
{
    client.on('interactionCreate', async (interaction: Interaction) => {
        if(!interaction.isButton()) return

        if(interaction.component.label === "Tuning") {
            return createTuningTicket(interaction)
        }

        if(interaction.component.label === "Zamknij Ticket") {
            interaction.reply({ content: "Closing ticket...", ephemeral: true }).then((message) => {
                setTimeout(() => {
                    message.delete()
                    const TICKET_CHANNEL = interaction.guild!.channels.cache.find(c => c.id === interaction.channel!.id) as GuildChannel
    
                    TICKET_CHANNEL.setParent("1180633766713106443")
                    TICKET_CHANNEL.lockPermissions()
                    return
                }, 1000)
            })
        }
    })
}