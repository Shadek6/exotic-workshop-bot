import { ChatInputCommandInteraction, GuildTextBasedChannel, EmbedBuilder } from 'discord.js';
import { MongoClient } from 'mongodb'
import { getUserData } from './getUserData';
import { logMessage } from './logMessage';
import { client } from '../index';
const uri = "mongodb+srv://Shadek:JJMLKOkrtYN1WLAK@cluster0.adjn4.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri).db('exotic-workshop').collection('workers');

export async function addUserData(USER_ID: string, CHAR_NAME: string, PHONE_NUMBER: string, ACCOUNT_NUMBER: string, interaction: ChatInputCommandInteraction) 
{
    const CONTACT_CHANNEL = (client.channels.cache.get(process.env.CONTACT_CHANNEL!)) as GuildTextBasedChannel

    if(await getUserData(interaction.user.id)) 
    {
        interaction.reply({ content: `Posiadasz aktywny wpis w bazie danych użytkowników! Jeżeli uważasz, że to błąd, skontaktuj się z właścicielami w celu usunięcia!`, ephemeral: true})
        logMessage(2, `Użytkownik ${interaction.user.username} natrafił na błąd przy dodawaniu informacji do bazy pracowników!`)
        return
    }

    if(!CHAR_NAME.includes(" ") || PHONE_NUMBER.length !== 6 || ACCOUNT_NUMBER.length !== 10) {
        interaction.reply({ content: `Podano niepoprawne dane! Sprawdź poprawność zapisu swoich parametrów!`, ephemeral: true})
        logMessage(2, `Użytkownik ${interaction.user.username} natrafił na błąd przy dodawaniu informacji do bazy pracowników!`)
        return 
    }

    const WORKER_EMBED = new EmbedBuilder()
    .setTitle(interaction.user.username)
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields({ name: "Character", value: CHAR_NAME}, { name: "Phone", value: PHONE_NUMBER}, { name: "Bank Account", value: ACCOUNT_NUMBER})

    mongoClient.insertOne({ user_id: USER_ID, char_name: CHAR_NAME, phone_number: PHONE_NUMBER, account_number: ACCOUNT_NUMBER })
    .then(() => {
        interaction.reply({ content: `Poprawnie dodano Twoje dane do bazy pracowników! Uzyskujesz dostęp do premii!`, ephemeral: true})
        CONTACT_CHANNEL.send({ embeds: [WORKER_EMBED] })
        logMessage(0, `Użytkownik ${interaction.user.username} dodał dane postaci ${CHAR_NAME} do bazy pracowników!`)
        return
    })
    .catch(() => {
        interaction.reply({ content: `Wystąpił błąd przy dodawaniu Twoich danych do bazy pracowników! Spróbuj ponownie później...`, ephemeral: true})
        logMessage(2, `Użytkownik ${interaction.user.username} natrafił na błąd przy dodawaniu informacji do bazy pracowników!`)
        return
    })
}