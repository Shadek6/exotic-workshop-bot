import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, ChatInputCommandInteraction } from "discord.js";

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