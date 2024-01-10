import { GuildMember, TextBasedChannel, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { client } from "..";
import { createButton } from "../func/util/createButton";

export class VerifyController {
    public async sendVerify(user_id: string, channel_id: string) {
        const fetchedUser = client.guilds.cache.get(process.env.GUILD_ID!)?.members.cache.get(user_id) as GuildMember;
        const fetchedChannel = client.channels.cache.get(channel_id) as TextBasedChannel;

        if (!fetchedUser?.roles.cache.has(process.env.CEO_ID!)) return "TicketsController:sendVerify - User is not CEO";

        const verifyEmbed = new EmbedBuilder()
            .setTitle("Weryfikacja")
            .setDescription("Aby otrzymać dostęp do serwera, musisz przejść weryfikację. W tym celu, wciśnij poniższy przycisk.")
            .setColor("Random")
            .setTimestamp()
            .setImage(process.env.EXOTIC_LOGO as string);

        const VERIFY_BUTTON = createButton("PRIMARY", "verify", "Weryfikuj", "🔒");
        const BUTTONS_ROW = new ActionRowBuilder<ButtonBuilder>().addComponents(VERIFY_BUTTON);

        if (await fetchedChannel?.send({ embeds: [verifyEmbed], components: [BUTTONS_ROW] })) return "TicketsController:sendVerify - Verify sent";
        else return "TicketsController:sendVerify - Verify not sent";
    }

    public async grantAccess(user_id: string) {
        const fetchedUser = client.guilds.cache.get(process.env.GUILD_ID!)?.members.cache.get(user_id) as GuildMember;
        if (!fetchedUser) return "TicketsController:grantAccess - User not found";

        if (await fetchedUser.roles.add(process.env.VERIFIED_ROLE_ID!)) return "TicketsController:grantAccess - Access granted";
        else return "TicketsController:grantAccess - Access not granted";
    }
}
