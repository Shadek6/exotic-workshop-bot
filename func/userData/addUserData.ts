import { ChatInputCommandInteraction, GuildTextBasedChannel, EmbedBuilder } from "discord.js";
import { MongoClient } from "mongodb";
import { getUserData } from "./getUserData";
import { logMessage } from "../logMessage";
import { client } from "../../index";
const uri = process.env.MONGO_URI!;
const mongoClient = new MongoClient(uri).db("exotic-workshop").collection("workers");

export async function addUserData(USER_ID: string, CHAR_NAME: string, PHONE_NUMBER: string, ACCOUNT_NUMBER: string, interaction: ChatInputCommandInteraction) {
    const CONTACT_CHANNEL = client.channels.cache.get(process.env.CONTACT_CHANNEL!) as GuildTextBasedChannel;
    const INTERACTION_MEMBER = interaction.guild?.members.cache.get(interaction.user.id);

    if (!INTERACTION_MEMBER?.roles.cache.find(r => r.id === process.env.WORKER_ID!)) {
        interaction.reply({ content: `Nie posiadasz odpowiedniej roli, która pozwoliłaby na wywołanie tej komendy!`, ephemeral: true });
        await logMessage(2, interaction.user.username, "Register Error", `Użytkownik próbował dodać dane do bazy bez roli pracownik!`, interaction.user.id);
        return;
    }

    if (await getUserData(interaction.user.id)) {
        interaction.reply({
            content: `Posiadasz aktywny wpis w bazie danych użytkowników! Jeżeli uważasz, że to błąd, skontaktuj się z właścicielami w celu usunięcia!`,
            ephemeral: true,
        });
        await logMessage(2, interaction.user.username, "Register Error", `Użytkownik natrafił na błąd przy dodawaniu informacji do bazy pracowników!`, interaction.user.id);
        return;
    }

    if (!CHAR_NAME.includes(" ") || PHONE_NUMBER.length !== 6 || ACCOUNT_NUMBER.length !== 10) {
        interaction.reply({ content: `Podano niepoprawne dane! Sprawdź poprawność zapisu swoich parametrów!`, ephemeral: true });
        await logMessage(2, interaction.user.username, "Register Error", `Użytkownik natrafił na błąd przy dodawaniu informacji do bazy pracowników!`, interaction.user.id);
        return;
    }

    const WORKER_EMBED = new EmbedBuilder()
        .setTitle(interaction.user.username)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields({ name: "Character", value: CHAR_NAME }, { name: "Phone", value: PHONE_NUMBER }, { name: "Bank Account", value: ACCOUNT_NUMBER });

    const successMessage = "Poprawnie dodano Twoje dane do bazy pracowników! Uzyskujesz dostęp do premii!";
    const errorMessage = "Wystąpił błąd przy dodawaniu Twoich danych do bazy pracowników! Spróbuj ponownie później...";
    const successDescription = `Użytkownik dodał dane postaci \`${CHAR_NAME}\` do bazy pracowników!`;
    const errorDescription = "Użytkownik natrafił na błąd przy dodawaniu informacji do bazy pracowników!";

    const USER_MESSAGE = await CONTACT_CHANNEL.send({ embeds: [WORKER_EMBED] });

    mongoClient.insertOne({ user_id: USER_ID, char_name: CHAR_NAME, phone_number: PHONE_NUMBER, account_number: ACCOUNT_NUMBER, message_id: USER_MESSAGE.id })
    .then(async () => {
        await interaction.reply({ content: successMessage, ephemeral: true });
        await logMessage(0, interaction.user.username, "Register Success", successDescription, interaction.user.id);
    })
    .catch(async () => {
        await interaction.reply({ content: errorMessage, ephemeral: true });
        await logMessage(2, interaction.user.username, "Register Error", errorDescription, interaction.user.id);
    });
}
