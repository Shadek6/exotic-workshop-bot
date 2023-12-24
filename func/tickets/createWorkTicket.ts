import { ChatInputCommandInteraction, ChannelType, PermissionsBitField, EmbedBuilder, TextBasedChannel, ButtonBuilder, ActionRowBuilder, ButtonInteraction } from "discord.js"
import { logMessage } from "../logMessage"
import { createButton } from "../utility/createButton"

export async function createWorkTicket(interaction: ButtonInteraction) {
    interaction.guild!.channels.create({
        name: `rekrutacja-${interaction.user.username}`,
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
                id: "1178743386610606153", // Team Role
                allow: [PermissionsBitField.Flags.ViewChannel]
            }

        ]
    }).then(async (ticketChannel: TextBasedChannel) => {
        const WELCOME_EMBED = new EmbedBuilder()
        .setAuthor( { name: interaction.user.username } )
        .setTitle("**Ticket rekrutacyjny**")
        .setDescription("Witaj w tickecie, który rozpoczyna Twój proces rekrutacji! Umów się z którymś z naszych rekruterów w grze, aby dołączyć do naszego zespołu.")
        .setColor("Random")
        .setThumbnail("https://i.imgur.com/lBJ36PT.png?size=4096")
        .setTimestamp()

        const CLOSE_BUTTON = createButton("DANGER", "close-work-ticket", "Zamknij Ticket", "🔒")

        const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(CLOSE_BUTTON)

        const INTERACTION_REPLY = interaction as unknown as ChatInputCommandInteraction
        await INTERACTION_REPLY.reply({ content: `Pomyślnie stworzono Ticket <#${ticketChannel.id}>`, ephemeral: true })
        ticketChannel.send({ content: `<@!${interaction.user.id}>`, embeds: [WELCOME_EMBED], components: [BUTTONS_ROW] })

        await logMessage(3, interaction.user.username, "Work Ticket Creation", "Użytkownik stworzył Ticket w panelu `Praca`")

        ticketChannel.send("<@&1178743386610606153>").then((newMessage => {
            setTimeout(async () => {
                await newMessage.delete()
            }, 1000)
        }))
    })
}