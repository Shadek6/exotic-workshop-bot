import { EmbedBuilder, GuildChannel, Interaction } from "discord.js";

import { client } from "../..";
import { createPartnerTicket } from "../tickets/createPartnerTicket";
import { createTuningTicket } from "../tickets/createTuningTicket";
import { createWorkTicket } from "../tickets/createWorkTicket";
import { logMessage } from "../logMessage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initButtonsListener() {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) return;
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
            setTimeout(async () => {
                await logMessage(0, interaction.user.username, "Ticket Closed", `Użytkownik zamknął ticket!`, interaction.user.id);
                interaction.channel!.delete();
                return;
            }, 2000);
        }

        if (interaction.customId === "partner") {
            return createPartnerTicket(interaction);
        }

        if (interaction.customId === "close-tuning-ticket") {
            interaction.reply({ content: "Closing ticket...", ephemeral: true }).then((message) => {
                setTimeout(async () => {
                    message.delete();
                    const TICKET_CHANNEL = interaction.guild!.channels.cache.find((c) => c.id === interaction.channel!.id) as GuildChannel;

                    TICKET_CHANNEL.setParent("1180633766713106443");
                    TICKET_CHANNEL.lockPermissions();
                    await logMessage(0, interaction.user.username, "Ticket Closed", `Użytkownik zamknął ticket!`, interaction.user.id);
                    return;
                }, 1000);
            });
        }

        if (interaction.customId === "payout-bonus") {
            const INTERACTION_USER = interaction.guild?.members.cache.get(interaction.user.id);

            if (!INTERACTION_USER?.roles.cache.find((r) => r.name === "CEO")) {
                await interaction.reply({ content: `Nie posiadasz permisji pozwalających na zmianę statusu premii!`, ephemeral: true });
                return;
            }

            const MESSAGE_EMBED = interaction.message.embeds[0];

            if (MESSAGE_EMBED.fields[6].value !== "<:timescircle:1181629847911546920>") {
                await interaction.reply({ content: `Ta premia została już wypłacona.`, ephemeral: true });
                return;
            }

            await interaction.reply({ content: `Zmieniam status na \`WYPŁACONY\``, ephemeral: true });
            MESSAGE_EMBED.fields[6].value = "<:checksquare:1181629839279652924>";

            const EMBED_AUTHOR = interaction.guild?.members.cache.find((u) => u.nickname === MESSAGE_EMBED.author?.name);

            if (EMBED_AUTHOR !== undefined) {
                const USER_DM = await EMBED_AUTHOR?.createDM(true);

                const THANKS_EMBED = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({ name: `${EMBED_AUTHOR.nickname}` })
                    .setTitle("Premia Wypłacona")
                    .setDescription(`Twoja premia w wysokości \`${MESSAGE_EMBED.fields[3].value}\` została przekazana na Twoje konto! Dziękujemy za pracę w **Exotic Workshop**!`)
                    .setImage(process.env.EXOTIC_LOGO as string);

                USER_DM?.send({ embeds: [THANKS_EMBED] });

                await interaction.message.edit({ embeds: [MESSAGE_EMBED] });
                return;
            }

            await interaction.reply({ content: `Nie udało się wysłać wiadomości do użytkownika!`, ephemeral: true });
            await interaction.message.edit({ embeds: [MESSAGE_EMBED] });
        }
    
        if(interaction.customId === "verify") {
            const INTERACTION_USER = interaction.guild?.members.cache.get(interaction.user.id);

            if(INTERACTION_USER?.roles.cache.has(process.env.VERIFIED_ID as string)) {
                await interaction.reply({ content: `Posiadasz już rolę \`Klient\`!`, ephemeral: true });
                return;
            }

            try {
                await INTERACTION_USER?.roles.add(process.env.VERIFIED_ID as string);
                await interaction.reply({ content: `Poprawnie dodano rolę \`Klient\`!`, ephemeral: true });
            } catch {
                await interaction.reply({ content: `Nie udało się nadać roli \`Klient\`!`, ephemeral: true });
            }
        }
    });
}
