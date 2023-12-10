import { ChatInputCommandInteraction, ChannelType, PermissionsBitField, EmbedBuilder, TextBasedChannel, ButtonBuilder, ActionRowBuilder, Interaction } from "discord.js";
import { logMessage } from "../logMessage";
import { createButton } from "../utility/createButton";

export async function createTuningTicket(interaction: ChatInputCommandInteraction | Interaction) {
    interaction
        .guild!.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: process.env.TICKETS_PARENT,
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
                },
                {
                    id: `${process.env.MANAGER_ID}`,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: `${process.env.EXPERIENCED_ID}`,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: `${process.env.EMPLOYEE_ID}`,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: `${process.env.ROOKIE_ID}`,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        })
        .then(async (ticketChannel: TextBasedChannel) => {
            const WELCOME_EMBED = new EmbedBuilder()
                .setAuthor({ name: "Zlecenie Tuningu" })
                .setTitle("**Wzór formularza tuningowego**")
                .setDescription("```Imię i nazwisko właściciela:\nPojazd:\nTuning:\nNumer telefonu:```")
                .setColor("Random")
                .setThumbnail("https://i.imgur.com/lBJ36PT.png?size=4096")
                .setTimestamp();

            const CLOSE_BUTTON = createButton("DANGER", "close-tuning-ticket", "Zamknij Ticket", "🔒");

            const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>().addComponents(CLOSE_BUTTON);

            await ticketChannel.send({ content: `<@!${interaction.user.id}>`, embeds: [WELCOME_EMBED], components: [BUTTONS_ROW] });

            await logMessage(3, interaction.user.username, "Tuning Ticket Creation", "Użytkownik stworzył Ticket w panelu `Tuning`");

            ticketChannel.send("@everyone").then((newMessage) => {
                setTimeout(async () => {
                    await newMessage.delete();
                }, 1000);
            });
        });
}