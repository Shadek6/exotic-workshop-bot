import { ChatInputCommandInteraction } from "discord.js";
import { MongoClient } from "mongodb";
import { logMessage } from "../logMessage";
const uri = process.env.MONGO_URI!;
const mongoClient = new MongoClient(uri).db("exotic-workshop").collection("workers");

export function removeUserData(USER_ID: string, interaction: ChatInputCommandInteraction) 
{
    mongoClient.deleteOne({ user_id: USER_ID })
    .then(() => {
        interaction.reply({ content: `Poprawnie usunięto z bazy wpis pracownika o ID \`${USER_ID}\``, ephemeral: true})
        logMessage(0, interaction.user.username, "Unregister Worker", `Usunięto z bazy danych wpis pracownika o ID \`${USER_ID}\``, interaction.user.id)
        return
    })
    .catch(() => {
        interaction.reply({ content: `Wystąpił błąd podczas usuwania pracownika o ID \`${USER_ID}\``, ephemeral: true})
        logMessage(2, interaction.user.username, "Unregister Worker", `Użytkownik natrafił na błąd podczas usuwania użytkownika o ID \`${USER_ID}\` z bazy pracowników.`, interaction.user.id)
        return 1;
    })
}