import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Interaction, PermissionsBitField, TextBasedChannel } from "discord.js";
import { logMessage } from "../logMessage";
export async function createPartnerTicket(interaction: Interaction) {
    if(interaction.isButton()) return;

    interaction.guild!.channels.create({
        name: `partner-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: "1178754969067847741",
        permissionOverwrites: [
            {
                id: interaction.guild!.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user!.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: `${process.env.CEO_ID}`,
                allow: [PermissionsBitField.Flags.ViewChannel],
            }
        ]
    }).then((ticketChannel: TextBasedChannel) => {
        ticketChannel.send({ content: `<@!${interaction.user.id}>` })
        const WELCOME_EMBED = new EmbedBuilder()
            .setAuthor({ name: "Partnerzy" })
            .setTitle("**Wzór formularza partnerskiego**")
            .setDescription("Witaj w panelu partnerskim! Opisz poniżej sprawę z którą przychodzisz do nas, a my postaramy się jak najszybciej odpowiedzieć na Twoje zgłoszenie!")
            .setColor("Random")
            .setThumbnail("https://i.imgur.com/lBJ36PT.png?size=4096")
            .setTimestamp()

        const CLOSE_BUTTON = new ButtonBuilder()
        .setCustomId("close-tuning-ticket")
        .setLabel("Zamknij Ticket")
        .setStyle(ButtonStyle.Danger)

        const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(CLOSE_BUTTON)

        ticketChannel.send({ embeds: [WELCOME_EMBED], components: [BUTTONS_ROW] })

        logMessage(3, interaction.user.username, "Partner Ticket Creation", "Użytkownik stworzył Ticket w panelu `Partnerzy`")

        ticketChannel.send("@everyone").then((newMessage => {
            setTimeout(() => {
                newMessage.delete()
            }, 1000)
        }))
    })
}