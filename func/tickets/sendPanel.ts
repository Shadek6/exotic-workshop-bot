import { Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export async function sendPanel(interaction: Interaction) 
{
    const PANEL_EMBED = new EmbedBuilder()
    .setTitle("Panel ticketów")
    .setDescription("Wybierz którąś z poniższych opcji w celu założenia ticketa.")

    const TUNING_BUTTON = new ButtonBuilder()
    .setCustomId("tuning")
    .setLabel("Tuning")
    .setEmoji("🏁")
    .setStyle(ButtonStyle.Primary)

    const TEAM_BUTTON = new ButtonBuilder()
    .setCustomId("work")
    .setLabel("Praca")
    .setEmoji("📝")
    .setStyle(ButtonStyle.Primary)

    const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(TUNING_BUTTON, TEAM_BUTTON)

    interaction.channel!.send({ embeds: [PANEL_EMBED], components: [BUTTONS_ROW] })
    return
}