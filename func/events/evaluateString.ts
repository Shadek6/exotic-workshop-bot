import { ChatInputCommandInteraction } from "discord.js"
import { resolveError } from "../utility/resolveError"

export async function evaluateString(INPUT: string, interaction: ChatInputCommandInteraction) {
    if(!interaction.isChatInputCommand()) return null
    if(interaction.user.id !== "320955077223383040") return null

    try {
        await interaction.reply({ content: `Wynik: \`${eval(INPUT)}\``, ephemeral: true, fetchReply: false })
    } catch(error) {
        return resolveError("evaluateString.ts", error)
    }
}