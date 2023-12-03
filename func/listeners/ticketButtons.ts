import { GuildChannel, Interaction } from "discord.js";
import { client } from "../..";
import { createTuningTicket } from "../tickets/createTuningTicket";
import { createWorkTicket } from "../tickets/createWorkTicket";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initTicketClose() {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        // Open tickets depending on their ID
        if (interaction.component.label === "Tuning") {
            return createTuningTicket(interaction);
        }

        if (interaction.component.label === "Praca") {
            return createWorkTicket(interaction);
        }

        // Close tickets
        if (interaction.customId === "close-work-ticket") {
            interaction.reply({ content: `Closing ticket in 1s...`, ephemeral: true });
            setTimeout(() => {
                interaction.channel!.delete();
                return;
            }, 2000);
        }

        if (interaction.customId === "close-tuning-ticket") {
            interaction.reply({ content: "Closing ticket...", ephemeral: true }).then((message) => {
                setTimeout(() => {
                    message.delete();
                    const TICKET_CHANNEL = interaction.guild!.channels.cache.find((c) => c.id === interaction.channel!.id) as GuildChannel;

                    TICKET_CHANNEL.setParent("1180633766713106443");
                    TICKET_CHANNEL.lockPermissions();
                    return;
                }, 1000);
            });
        }
    });
}
