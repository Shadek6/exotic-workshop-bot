import { Interaction } from "discord.js";
import { client, payoutController } from "..";

export class ButtonsController {
    constructor() {}

    async init() {
        console.log("ButtonsController:Initialized!");

        client.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isButton()) return;

            switch (interaction.customId) {
                case "payout-bonus": {
                    const payoutResult = await payoutController.updateBonusStatus(interaction.user.id, interaction.message);
                    if (payoutResult === "PayoutController:updateBonusStatus - Bonus paid") {
                        await interaction.reply({ content: "Bonus został wypłacony!", ephemeral: true });
                    } else await interaction.reply({ content: "Nie udało się wypłacić bonusu!", ephemeral: true });
                    break;
                }
            }
        });
    }
}
