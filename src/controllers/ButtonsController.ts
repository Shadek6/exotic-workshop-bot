import { Interaction } from "discord.js";
import { client, payoutController, ticketsController } from "..";
import { TicketType } from "../types/TicketType";

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

                case "verify": {

                    break;
                }

                case "tuning": 
                {
                    if(await ticketsController.createTicket(interaction.user.id, TicketType.Tuning, [process.env.CEO_ID!, process.env.BASE_WORKER_ROLE_ID!]) === "TicketsController:createTicket - Ticket sent")
                    {
                        await interaction.reply({ content: "Ticket został utworzony!", ephemeral: true });
                    }
                    else
                    {
                        await interaction.reply({ content: "Nie udało się utworzyć ticketu!", ephemeral: true });
                    }
                    break;
                }

                case "praca": 
                {
                    if(await ticketsController.createTicket(interaction.user.id, TicketType.Work, [process.env.CEO_ID!, "1178743386610606153"]) === "TicketsController:createTicket - Ticket sent")
                    {
                        await interaction.reply({ content: "Ticket został utworzony!", ephemeral: true });
                    }
                    else
                    {
                        await interaction.reply({ content: "Nie udało się utworzyć ticketu!", ephemeral: true });
                    }
                    break;
                }

                case "współpraca": {
                    if(await ticketsController.createTicket(interaction.user.id, TicketType.Partnership, [process.env.CEO_ID!]) === "TicketsController:createTicket - Ticket sent")
                    {
                        await interaction.reply({ content: "Ticket został utworzony!", ephemeral: true });
                    }
                    else
                    {
                        await interaction.reply({ content: "Nie udało się utworzyć ticketu!", ephemeral: true });
                    }
                    break;
                }

                case "close-ticket": 
                {
                    await ticketsController.closeTicket(interaction.user.id, interaction.message.channelId)
                    break;
                }
            }
        });
    }
}
