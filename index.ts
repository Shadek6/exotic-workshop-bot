import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { calculateBonus } from "./func/calculateBonus";
import { addUserData } from "./func/userData/addUserData";
import { initButtonsListener } from "./func/listeners/initButtonsListener";
import { sendPanel } from "./func/tickets/sendPanel";
import { removeUserData } from "./func/userData/removeUserData";
import { initMessagesEvents } from "./func/events/initMessagesEvents";
export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.MessageContent],
});

initButtonsListener();
initMessagesEvents();

client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isChatInputCommand) return;

    try {
        if (interaction.commandName === "premia") calculateBonus(interaction, interaction.options.getNumber("kwota"), interaction.options.getString("zwrot"));

        if (interaction.commandName === "register") addUserData(interaction.user.id, interaction.options.getString("imie_nazwisko"), interaction.options.getString("phone"), interaction.options.getString("bank_acc"), interaction);

        if (interaction.commandName === "send-panel") sendPanel(interaction);

        if (interaction.commandName === "unregister") removeUserData(interaction.options.getString("user_id"), interaction);
    } catch (err) { console.log(err) }
});

client.login(process.env.TOKEN);
