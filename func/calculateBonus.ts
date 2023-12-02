import { ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel } from 'discord.js'
import { client } from '../index'
import { getUserData } from './getUserData'
const ROLES_ID = [[process.env.ROOKIE_ID, 0.5], [process.env.EMPLOYEE_ID, 0.55], [process.env.EXPERIENCED_ID, 0.6], [process.env.MANAGER_ID, 0.65], [process.env.CEO_ID, 0.7]]


export async function calculateBonus(interaction: ChatInputCommandInteraction, passedNumber: number) {
    const USER_BANK_ACC = await getUserData(interaction.user.id)

    if(!USER_BANK_ACC) {
        interaction.reply({ content: `Nie posiadasz wpisanego aktywnego konta w bazie pracowników! Użyj formularza rejestracyjnego w celu dodania swoich danych`, ephemeral: true})
        return
    }
    
    const USER_GUILD = await client.guilds.fetch("1178742962138652712")
    const fullUserInfo = await USER_GUILD.members.fetch(interaction.user.id)

    ROLES_ID.forEach((role) => {
        const CURRENT_ROLE = fullUserInfo.roles.cache.find(r => r.id === role[0])
        const BONUS_CHANNEL = client.channels.cache.get("1178750239251890266") as GuildTextBasedChannel

        if(CURRENT_ROLE != null) 
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const USER_PERCENT: any = role[1]!

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const BONUS_EMBED = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Premia')
            .setThumbnail(`${interaction.user.avatarURL()}?size=4096`)
            .setAuthor({ name: `${fullUserInfo.nickname}`, iconURL: `${interaction.user.avatarURL()}`})
            .setTimestamp()
            .addFields({ name: "Kwota robocizny", value: `$${passedNumber}`, inline: true})
            .addFields({ name: "Premia", value: `$${passedNumber * USER_PERCENT}`, inline: true})
            .addFields({ name: "Procent", value: `${USER_PERCENT*100}% (${CURRENT_ROLE.name})`, inline: true})
            .addFields({ name: "Numer konta", value: `${USER_BANK_ACC?.account_number}`, inline: false})

            const BONUS_MESSAGE = BONUS_CHANNEL.send({ embeds: [BONUS_EMBED]})

            BONUS_MESSAGE.then((message) => {
                return interaction.reply({ content: `Poprawnie dodano wiadomość na kanał Premie! ID Wiadomości: \`${message.id}\``, ephemeral: true})
            })
            .catch(() => {
                return interaction.reply({ content: `Wystąpił błąd podczas wysyłania wiadomości! Spróbuj jeszcze raz...`, ephemeral: true})
            })
        }
    })

    return
}