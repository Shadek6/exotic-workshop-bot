import 'dotenv/config'
import { Client, GatewayIntentBits } from "discord.js"
import { calculateBonus } from './func/calculateBonus'
import { addUserData } from './func/addUserData'
import { createTuningTicket } from './func/tickets/createTuningTicket'
import { initTicketClose } from './func/listeners/ticketButtons'
import { sendPanel } from './func/tickets/sendPanel'
export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.MessageContent] })

initTicketClose()

client.on('interactionCreate', async (interaction: any) => {
    if(!interaction.isChatInputCommand) return

    if(interaction.commandName === "premia") {
        calculateBonus(interaction, interaction.options.getNumber("kwota"))
        return 
    }

    if(interaction.commandName === "register") {
        addUserData(interaction.user.id, interaction.options.getString("imie_nazwisko"), interaction.options.getString("phone"), interaction.options.getString("bank_acc"), interaction)
        return 
    }

    if(interaction.commandName === "open-ticket") {
        createTuningTicket(interaction)
        return
    }

    if(interaction.commandName === "send-panel") {
        sendPanel(interaction)
        return
    }
})

client.login(process.env.TOKEN)