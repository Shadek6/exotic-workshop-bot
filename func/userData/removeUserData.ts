
import { ChatInputCommandInteraction } from "discord.js";
import { MongoClient } from "mongodb";
import { logMessage } from "../logMessage";

const uri = process.env.MONGO_URI!;
const mongoClient = new MongoClient(uri).db("exotic-workshop").collection("workers");

export function removeUserData(USER_ID: string, interaction: ChatInputCommandInteraction) {
    // Fetch the member object of the user from the guild
    const member = interaction.guild?.members.cache.get(interaction.user.id);

    // Check if the member has the CEO or Manager role
    if (!member?.roles.cache.has(process.env.CEO_ID!) && !member?.roles.cache.has(process.env.MANAGER_ID!)) {
        // If not, reply with an error message and log the unauthorized attempt
        interaction.reply({ content: "Nie posiadasz uprawnień do wykonania tej czynności.", ephemeral: true });
        logMessage(2, interaction.user.username, "Unregister Worker", `Użytkownik próbował usunąć użytkownika o ID \`${USER_ID}\` z bazy pracowników, ale nie posiada uprawnień do tej czynności.`, interaction.user.id);
        return;
    }

    // Delete the user's data from the database
    mongoClient
        .deleteOne({ user_id: USER_ID })
        .then(() => {
            // If the deletion is successful, reply with a success message and log the deletion
            interaction.reply({ content: `Poprawnie usunięto z bazy wpis pracownika o ID \`${USER_ID}\``, ephemeral: true });
            logMessage(0, interaction.user.username, "Unregister Worker", `Usunięto z bazy danych wpis pracownika o ID \`${USER_ID}\``, interaction.user.id);
        })
        .catch(() => {
            // If there is an error during the deletion, reply with an error message and log the error
            interaction.reply({ content: `Wystąpił błąd podczas usuwania pracownika o ID \`${USER_ID}\``, ephemeral: true });
            logMessage(2, interaction.user.username, "Unregister Worker", `Użytkownik natrafił na błąd podczas usuwania użytkownika o ID \`${USER_ID}\` z bazy pracowników.`, interaction.user.id);
        });
}
