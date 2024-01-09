import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel } from "discord.js";

import { client } from "../index";
import { createButton } from "./utility/createButton";
import { getUserData } from "./userData/getUserData";
import { resolveError } from "./utility/resolveError";
import { WorkerUser } from "../types/WorkerUser";

const ROLES_ID = [
    [process.env.ROOKIE_ID, 0.4],
    [process.env.EMPLOYEE_ID, 0.5],
    [process.env.EXPERIENCED_ID, 0.55],
    [process.env.MANAGER_ID, 0.6],
    [process.env.CEO_ID, 0.65],
];

export async function calculateBonus(interaction: ChatInputCommandInteraction, passedNumber: number, toReturn: string) {
    if (!interaction.isChatInputCommand() || interaction === undefined) return;

    const USER_BANK_ACC = (await getUserData(interaction.user.id)) as WorkerUser;

    if (!USER_BANK_ACC) {
        interaction.reply({
            content: `Nie posiadasz wpisanego aktywnego konta w bazie pracowników! Użyj formularza rejestracyjnego w celu dodania swoich danych`,
            ephemeral: true,
        });
        return;
    }

    const fullUserInfo = await interaction.guild!.members.cache.get(interaction.user.id);

    ROLES_ID.forEach(async (role) => {
        const CURRENT_ROLE = fullUserInfo?.roles.cache.find((r) => r.id === role[0]);
        const BONUS_CHANNEL = client.channels.cache.get("1178750239251890266") as GuildTextBasedChannel;
        const NOW_DATE = new Date(Date.now()).toLocaleDateString("pl-PL");
        const NOW_HOURS = new Date().getUTCHours() + 1;
        const NOW_MINUTES = new Date().getUTCMinutes() < 10 ? `0${new Date().getUTCMinutes()}` : new Date().getUTCMinutes();

        if (CURRENT_ROLE != null) {
            const USER_PERCENT = role[1] as number;
            const USER_PAYOUT = toReturn === "false" ? (passedNumber * USER_PERCENT).toFixed(0) : passedNumber;
            toReturn === "true" ? (toReturn = "TAK") : (toReturn = "NIE");

            try {
                const BONUS_EMBED = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`Premia - ${(USER_PERCENT * 100).toFixed(0)}%`)
                    .setAuthor({ name: `${fullUserInfo?.nickname}`, iconURL: `${interaction.user.avatarURL()}` })
                    .addFields({ name: "Imię i nazwisko", value: `${USER_BANK_ACC.char_name}`, inline: true })
                    .addFields({ name: "Data", value: `${NOW_DATE} ${NOW_HOURS}:${NOW_MINUTES}`, inline: true })
                    .addFields({ name: "Robocizna", value: `$${passedNumber}`, inline: true })
                    .addFields({ name: "Premia", value: `$${USER_PAYOUT}`, inline: true })
                    .addFields({ name: "Numer konta", value: `${USER_BANK_ACC.account_number}`, inline: true })
                    .addFields({ name: "Zwrot", value: `${toReturn}`, inline: true })
                    .addFields({ name: "Status", value: "<:timescircle:1181629847911546920>", inline: false })
                    .addFields({ name: "Wypłacone przez", value: "-", inline: true });

                const CLOSE_BUTTON = createButton("PRIMARY", "payout-bonus", "Wypłać", "<:ilo_procent:1180622707700805783>");
                const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>().addComponents(CLOSE_BUTTON);
                const BONUS_MESSAGE = await BONUS_CHANNEL.send({ embeds: [BONUS_EMBED], components: [BUTTONS_ROW] });

                await interaction.reply({ content: `Poprawnie dodano wiadomość na kanał Premie! ID Wiadomości: \`${await BONUS_MESSAGE.id}\``, ephemeral: true });
            } catch (error) {
                return resolveError("calculateBonus.ts", error);
            }
        }
    });

    return;
}
