import { ChatInputCommandInteraction, ChannelType, PermissionsBitField, EmbedBuilder, TextBasedChannel, ButtonBuilder, ActionRowBuilder, ButtonStyle, Interaction } from "discord.js"
import { logMessage } from "../logMessage"

export async function createTuningTicket(interaction: ChatInputCommandInteraction | Interaction) {
    interaction.guild!.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: process.env.TICKETS_PARENT,
        permissionOverwrites: [
            {
                id: interaction.guild!.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: interaction.user!.id,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: `${process.env.CEO_ID}`,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: `${process.env.MANAGER_ID}`,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: `${process.env.EXPERIENCED_ID}`,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: `${process.env.EMPLOYEE_ID}`,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: `${process.env.ROOKIE_ID}`,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
        ]
    }).then((ticketChannel: TextBasedChannel) => {
        const WELCOME_EMBED = new EmbedBuilder()
        .setAuthor( { name: "Zlecenie Tuningu"} )
        .setTitle("**Wzór formularza tuningowego**")
        .setDescription("```Imię i nazwisko właściciela:\nPojazd:\nTuning:\nNumer telefonu:```")
        .setColor("Random")
        .setThumbnail("https://i.imgur.com/lBJ36PT.png?size=4096")
        .setTimestamp()

        const CLOSE_BUTTON = new ButtonBuilder()
        .setCustomId("close-tuning-ticket")
        .setLabel("Zamknij Ticket")
        .setStyle(ButtonStyle.Danger)

        const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(CLOSE_BUTTON)

        ticketChannel.send({ content: `<@!${interaction.user.id}>`, embeds: [WELCOME_EMBED], components: [BUTTONS_ROW] })

        logMessage(3, interaction.user.username, "Tuning Ticket Creation", "Użytkownik stworzył Ticket w panelu `Tuning`")

        ticketChannel.send("@everyone").then((newMessage => {
            setTimeout(() => {
                newMessage.delete()
            }, 1000)
        }))
    })
}