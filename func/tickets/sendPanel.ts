import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, GuildMember, ChatInputCommandInteraction } from "discord.js";
import { createButton } from "../utility/createButton";

export async function sendPanel(interaction: ChatInputCommandInteraction) 
{
    await interaction.guild?.members.fetch(interaction.user.id)
    .then(async (member: GuildMember) => 
    {
        if (!member.roles.cache.find(role => role.id === process.env.CEO_ID)) {
            interaction.reply({ content: "Nie posiadasz uprawnień do korzystania z tej komendy.", ephemeral: true })
            return
        }
    })

    const PANEL_EMBED = new EmbedBuilder()
    .setTitle("Panel ticketów")
    .setDescription("Wybierz którąś z poniższych opcji w celu założenia ticketa.")

    const TUNING_BUTTON = createButton("PRIMARY", "tuning", "Tuning", "🏁")

    const TEAM_BUTTON = createButton("PRIMARY", "work", "Praca", "📝")

    const PARTNER_BUTTON = createButton("PRIMARY", "partner", "Partnerstwo", "🤝")

    const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(TUNING_BUTTON, TEAM_BUTTON, PARTNER_BUTTON)

    await interaction.channel!.send({ embeds: [PANEL_EMBED], components: [BUTTONS_ROW] })
    await interaction.reply({ content: "Wysłano wiadomość na kanał.", ephemeral: true })
    return
}