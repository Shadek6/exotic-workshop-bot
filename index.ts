import "dotenv/config";

import { Client, GatewayIntentBits } from "discord.js";

import { addUserData } from "./func/userData/addUserData";
import { calculateBonus } from "./func/calculateBonus";
import { evaluateString } from "./func/events/evaluateString";
import { initButtonsListener } from "./func/listeners/initButtonsListener";
import { initMessagesEvents } from "./func/events/initMessagesEvents";
import { linkBlock } from "./func/listeners/linkBlock";
import { removeUserData } from "./func/userData/removeUserData";
import { sendPanel } from "./func/tickets/sendPanel";
import { sendVerify } from "./func/sendVerify";

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.MessageContent],
});

initButtonsListener();
initMessagesEvents();
linkBlock();

client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isChatInputCommand) return;

    if (interaction.commandName === "premia") await calculateBonus(interaction, interaction.options.getNumber("kwota"), interaction.options.getString("zwrot"));

    if (interaction.commandName === "register") await addUserData(interaction.user.id, interaction.options.getString("imie_nazwisko"), interaction.options.getString("phone"), interaction.options.getString("bank_acc"), interaction);

    if (interaction.commandName === "send-panel") await sendPanel(interaction);

    if (interaction.commandName === "unregister") await removeUserData(interaction.options.getString("user_id"), interaction);

    if(interaction.commandName === "evaluate-string") await evaluateString(interaction.options.getString("user_input"), interaction)

    if(interaction.commandName === "send-verify") await sendVerify(interaction)
});

client.login(process.env.TOKEN);
