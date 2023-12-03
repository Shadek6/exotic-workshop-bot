import { ChatInputCommandInteraction, ChannelType, PermissionsBitField, EmbedBuilder, TextBasedChannel, ButtonBuilder, ActionRowBuilder, ButtonStyle, Interaction } from "discord.js"
import { logMessage } from "../logMessage"

export async function createWorkTicket(interaction: ChatInputCommandInteraction | Interaction) {
    interaction.guild!.channels.create({
        name: `rekrutacja-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: "1178754969067847741",
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
                id: "1178743386610606153", // Team Role
                allow: [PermissionsBitField.Flags.ViewChannel]
            }

        ]
    }).then((ticketChannel: TextBasedChannel) => {
        const WELCOME_EMBED = new EmbedBuilder()
        .setAuthor( { name: interaction.user.username } )
        .setTitle("**Ticket rekrutacyjny**")
        .setDescription("Witaj w tickecie, który rozpoczyna Twój proces rekrutacji! Na początek przedstaw swoją postać i wizję na grę w gronie naszych pracowników! Zachęcamy do przedstawienia głównie background postaci oraz głównych motywów, które nią kierują - zarazem można umieścić doświadczenie w przeszłości i po krótce przedstawić swoją aktywność! Powodzenia!")
        .setColor("Random")
        .setThumbnail("https://i.imgur.com/lBJ36PT.png?size=4096")
        .setTimestamp()

        const CLOSE_BUTTON = new ButtonBuilder()
        .setCustomId("close-work-ticket")
        .setLabel("Zamknij Ticket")
        .setStyle(ButtonStyle.Danger)

        const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(CLOSE_BUTTON)

        ticketChannel.send({ content: `<@!${interaction.user.id}>`, embeds: [WELCOME_EMBED], components: [BUTTONS_ROW] })

        logMessage(3, `${interaction.user.username} stworzył ticket o nazwie rekrutacja-${interaction.user.username}!`)

        ticketChannel.send("<@&1178743386610606153>").then((newMessage => {
            setTimeout(() => {
                newMessage.delete()
            }, 1000)
        }))
    })
}