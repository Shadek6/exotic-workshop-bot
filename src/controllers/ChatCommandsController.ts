import { Interaction } from "discord.js";
import { client, workersController } from "../index"
import { evaluateString } from "../func/evaluateString";
import { payoutController } from "../index";
export class ChatCommandsController 
{

    constructor() {}
    async init() 
    {
        console.log("ChatCommandsController:Initialized!");

        client.on("interactionCreate", async (interaction: Interaction) => {
            if(!interaction.isChatInputCommand()) return

            switch(interaction.commandName) 
            {
                case "add-worker": 
                {
                    const user_id = interaction.options.getUser("user")!.id
                    const nickname_ic = interaction.options.getString("nickname_ic")!
                    const addWorkerResult = await workersController.addWorker(user_id, nickname_ic)

                    if(addWorkerResult === "WorkersController:addWorker - Worker added") await interaction.reply({ content: "Dodano pracownika!", ephemeral: true })
                    else if(addWorkerResult === "WorkersController:addWorker - Missing arguments") await interaction.reply({ content: "Nie podałeś wszystkich danych!", ephemeral: true });
                    else if(addWorkerResult === "WorkersController:addWorker - Worker not found") await interaction.reply({ content: "Nie znaleziono pracownika!", ephemeral: true });
                    else await interaction.reply({ content: "Nie udało się dodać pracownika!", ephemeral: true });

                    break;
                }

                case "register": {
                    const char_name = interaction.options.getString("imie_nazwisko")!;
                    const phone_number = interaction.options.getString("phone")!;
                    const account_number = interaction.options.getString("bank_acc")!;
                    const user_id = interaction.user.id;
                    const registerWorkerResult = await workersController.registerWorker(char_name, phone_number, account_number, user_id);

                    if(registerWorkerResult === "WorkersController:registerWorker - Worker already exists") await interaction.reply({ content: "Już jesteś zarejestrowany!", ephemeral: true });
                    else if(registerWorkerResult === "WorkersController:registerWorker - Invalid arguments") await interaction.reply({ content: "Niepoprawne dane!", ephemeral: true });
                    else if(registerWorkerResult === "WorkersController:registerWorker - Missing arguments") await interaction.reply({ content: "Nie podałeś wszystkich danych!", ephemeral: true });
                    else if(registerWorkerResult === "WorkersController:registerWorker - Worker registered") await interaction.reply({ content: "Zarejestrowano!", ephemeral: true });
                    else if(registerWorkerResult === "WorkersController:registerWorker - Worker not registered") await interaction.reply({ content: "Nie udało się zarejestrować!", ephemeral: true });
                    else await interaction.reply({ content: "Zarejestrowano!", ephemeral: true });

                    break;
                }

                case "unregister": {
                    const user_id = interaction.options.getString("user_id")!
                    const unregisterWorkerResult = await workersController.unregisterWorker(user_id);
                    if(unregisterWorkerResult === "WorkersController:unregisterWorker - Worker not found") await interaction.reply({ content: "Nie znaleziono pracownika!", ephemeral: true });
                    else if(unregisterWorkerResult === "WorkersController:unregisterWorker - Worker unregistered") await interaction.reply({ content: "Pracownik został usunięty!", ephemeral: true });
                    else await interaction.reply({ content: "Nie udało się usunąć pracownika!", ephemeral: true });
                    break;
                }

                case "evaluate-string": 
                {
                    const evalResult = evaluateString(interaction.user.id, interaction.options.getString("user_input")!);
                    if(evalResult === "evaluateString:no-permission") await interaction.reply({ content: "Nie masz uprawnień do tej komendy!", ephemeral: true });
                    else await interaction.reply({ content: evalResult, ephemeral: true });
                    break;
                }

                case "premia": 
                {
                    const passedNumber = interaction.options.getNumber("kwota")!
                    const toReturn = interaction.options.getString("zwrot")!
                    const bonusResult = await payoutController.calculateBonus(interaction.user.id, passedNumber, toReturn)
                    if(bonusResult === "PayoutController:calculateBonus - Payout sent") 
                    {
                        interaction.reply({ content: "Premia została wysłana!", ephemeral: true })
                    }
                    else 
                    {
                        interaction.reply({ content: "Nie udało się wysłać premii!", ephemeral: true })
                    }
                }
            }
        })
    }
}