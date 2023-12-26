import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, Role, UserMention } from "discord.js";

import { client } from "..";
import { createButton } from "./utility/createButton";
import { resolveError } from "./utility/resolveError";
import { getUserData } from "./userData/getUserData";
import { WorkerUser } from "../types/WorkerUser";

export async function addWorker(workerMention: UserMention, nicknameIC: string, interaction: ChatInputCommandInteraction) {
    const INTERACTION_USER = interaction.guild?.members.cache.get(interaction.user.id);
    const USER_BANK_ACC = await (getUserData(interaction.user.id)) as WorkerUser;

    if (!INTERACTION_USER?.roles.cache.has(process.env.CEO_ID!) && !INTERACTION_USER?.roles.cache.has(process.env.MANAGER_ID!)) {
        interaction.reply({ content: `Nie posiadasz uprawnień do tej komendy!`, ephemeral: true });
        return;
    }

    workerMention = `${await workerMention}`;
    const WORKER_USER = interaction.guild?.members.cache.get(workerMention.substring(2, workerMention.length - 1));
    const ROOKIE_ROLE = interaction.guild?.roles.cache.get(process.env.ROOKIE_ID as string) as Role;
    const WORKER_ROLE = interaction.guild?.roles.cache.get(process.env.WORKER_ID as string) as Role;
    const USER_NICKNAME = WORKER_USER?.nickname ? WORKER_USER?.nickname : WORKER_USER?.user.username;

    try {
        const GENERAL_CHANNEL = client.channels.cache.find((channel) => channel.id === "1178750677682507857") as GuildTextBasedChannel;
        const EMPLOYMENT_CHANNEL = client.channels.cache.find((channel) => channel.id === "1180269274678439956") as GuildTextBasedChannel;

        const Welcome_Embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Witaj w ekipie!")
            .setDescription(
                `Hejeczka ${workerMention} witamy w naszym zespole, mamy nadzieje że będziesz się tutaj świetnie bawić oraz się odnajdziesz w naszym środowisku, na samym początku zapoznaj się ze wszystkimi naszymi kanałami, najlepiej wszystkimi, poniżej zaś masz obowiązkowe kanały, aby móc się odnaleźć na naszym discordzie oraz na serwerze jako mechanik bez problemu, życzymy miłej pracy! :heart:`
            )
            .setThumbnail(`${WORKER_USER?.user.avatarURL()}?size=4096`)
            .addFields(
                { name: "Kontakt", value: `<#${process.env.CONTACT_CHANNEL as string}>`, inline: false },
                { name: "Premia", value: `<#${process.env.BONUS_CHANNEL as string}>`, inline: true },
                { name: "Wiedza", value: `<#1183198733513523241>`, inline: false },
                { name: "Komendy", value: `<#1178750743675670549>`, inline: true }
            )
            .setTimestamp();

        const Employment_Embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Zatrudnienie")
            .setAuthor({ name: `${INTERACTION_USER?.nickname}`, iconURL: `${INTERACTION_USER?.user.avatarURL()}` })
            .setDescription(`Zatrudniono użytkownika \`${nicknameIC}\` (${workerMention})`)
            .addFields({ name: `Status`, value: "<:timescircle:1181629847911546920>" }, { name: `Numer konta`, value: `${USER_BANK_ACC?.account_number}` })
            .setTimestamp();

        await WORKER_USER?.roles.add(ROOKIE_ROLE);
        await WORKER_USER?.roles.add(WORKER_ROLE);
        await WORKER_USER?.setNickname(`${nicknameIC} | ${USER_NICKNAME}`);
        
        const PAYOUT_BUTTON = createButton("PRIMARY", "employment-payout", "Wypłać", "<:ilo_procent:1180622707700805783>")
        
        const BUTTON_ROW = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(PAYOUT_BUTTON)

        await GENERAL_CHANNEL.send({ content: `${workerMention}`, embeds: [Welcome_Embed] });
        await EMPLOYMENT_CHANNEL.send({ content: `<@${interaction.user.id}>`, embeds: [Employment_Embed], components: [BUTTON_ROW] });

        return interaction.reply({ content: `Dodano ${workerMention} do ekipy!`, ephemeral: true });
    } catch (error) {
        return resolveError("addWorker.ts", error);
    }
}
