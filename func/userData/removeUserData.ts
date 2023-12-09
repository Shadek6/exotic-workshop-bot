import { ChatInputCommandInteraction, GuildTextBasedChannel } from "discord.js";
import { MongoClient } from "mongodb";
import { logMessage } from "../logMessage";

const uri = process.env.MONGO_URI!;
const mongoClient = new MongoClient(uri).db("exotic-workshop").collection("workers");

export async function removeUserData(USER_ID: string, interaction: ChatInputCommandInteraction) {
    const DATABASE_USER = await mongoClient.findOne({ user_id: USER_ID });
    const member = interaction.guild?.members.cache.get(interaction.user.id);

    if (!member?.roles.cache.find((r) => r.id === process.env.MANAGER_ID!) && !member?.roles.cache.find((r) => r.id === process.env.CEO_ID!)) {
        interaction.reply({ content: `Nie posiadasz odpowiednich permisji do użycia tej komendy.`, ephemeral: true });
        return;
    }

    if(!DATABASE_USER) {
        interaction.reply({ content: `Nie posiadasz aktywnego wpisu w bazie danych!`, ephemeral: true });
        return;
    }

    const MESSAGE_CHANNEL = interaction.guild?.channels.cache.get(process.env.CONTACT_CHANNEL!) as GuildTextBasedChannel;
    const MESSAGE = await MESSAGE_CHANNEL.messages.fetch(DATABASE_USER.message_id);

    mongoClient.deleteOne(DATABASE_USER)
    .then(async () => {
        await interaction.reply({ content: `Poprawnie usunięto wpis z bazy danych!`, ephemeral: true });
        await MESSAGE.delete();
        await logMessage(0, interaction.user.username, "Remove Success", `Użytkownik usunął z bazy wpis pracownika o ID \`${DATABASE_USER.user_id}\``);
    })
    .catch(async () => {
        await interaction.reply({ content: `Wystąpił błąd podczas usuwania wpisu z bazy danych!`, ephemeral: true });
        await logMessage(2, interaction.user.username, "Remove Error", `Użytkownik usunął z bazy wpis pracownika o ID \`${DATABASE_USER.user_id}\``);
    });
}
