import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel } from "discord.js";
import { client } from "../index";
import { getUserData } from "./userData/getUserData";
const ROLES_ID = [
    [process.env.ROOKIE_ID, 0.5],
    [process.env.EMPLOYEE_ID, 0.55],
    [process.env.EXPERIENCED_ID, 0.6],
    [process.env.MANAGER_ID, 0.65],
    [process.env.CEO_ID, 0.7],
];

export async function calculateBonus(interaction: ChatInputCommandInteraction, passedNumber: number, toReturn: string) {
    const USER_BANK_ACC = await getUserData(interaction.user.id);

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
        const NOW_HOURS = new Date().getUTCHours();
        const NOW_MINUTES = new Date().getUTCMinutes();

        if (CURRENT_ROLE != null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const USER_PERCENT: any = role[1]!;
            const USER_PAYOUT = toReturn === "false" ? parseFloat(((passedNumber * USER_PERCENT) / 1000).toFixed(1)) * 1000 : passedNumber;
            toReturn === "true" ? (toReturn = "TAK") : (toReturn = "NIE");

            const BONUS_EMBED = new EmbedBuilder()
                .setColor("Random")
                .setTitle(`Premia - ${USER_PERCENT * 100}%`)
                .setAuthor({ name: `${fullUserInfo?.nickname}`, iconURL: `${interaction.user.avatarURL()}` })
                .addFields({ name: "Imię i nazwisko", value: `${USER_BANK_ACC.char_name}`, inline: true })
                .addFields({ name: "Data", value: `${NOW_DATE} ${NOW_HOURS + 1}:${NOW_MINUTES}`, inline: true })
                .addFields({ name: "Robocizna", value: `$${passedNumber}`, inline: true })
                .addFields({ name: "Premia", value: `$${USER_PAYOUT}`, inline: true })
                .addFields({ name: "Numer konta", value: `${USER_BANK_ACC.account_number}`, inline: true })
                .addFields({ name: "Zwrot", value: `${toReturn}`, inline: true })
                .addFields({ name: "Status", value: "<:timescircle:1181629847911546920>", inline: false });

            const CLOSE_BUTTON = new ButtonBuilder().setCustomId("payout-bonus").setLabel("Wypłać").setStyle(ButtonStyle.Primary);

            const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>().addComponents(CLOSE_BUTTON);

            const BONUS_MESSAGE = await BONUS_CHANNEL.send({ embeds: [BONUS_EMBED], components: [BUTTONS_ROW] });

            await interaction.reply({ content: `Poprawnie dodano wiadomość na kanał Premie! ID Wiadomości: \`${BONUS_MESSAGE.id}\``, ephemeral: true });
        }
    });

    return;
}
