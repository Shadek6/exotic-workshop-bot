import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { createButton } from "./utility/createButton";

export async function sendVerify(interaction: ChatInputCommandInteraction) {
    const InteractionUser = interaction.guild?.members.cache.get(interaction.user.id)

    if(!InteractionUser?.roles.cache.has(process.env.CEO_ID!)) return interaction.reply({ content: "Nie posiadasz dostępu do tej komendy.", ephemeral: true })

    const VERIFY_EMBED = new EmbedBuilder()
    .setTitle("Weryfikacja")
    .setDescription("Aby otrzymać dostęp do serwera, musisz przejść weryfikację. W tym celu, wciśnij poniższy przycisk.")
    .setColor("Random")
    .setTimestamp()
    .setImage(process.env.EXOTIC_LOGO as string)

    const VERIFY_BUTTON = createButton("PRIMARY", "verify", "Weryfikuj", "🔒")
    const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(VERIFY_BUTTON)

    await interaction.channel?.send({ embeds: [VERIFY_EMBED], components: [BUTTONS_ROW] })
    await interaction.reply({ content: "Wysłano wiadomość na kanał.", ephemeral: true })
    return
}
