import { DiscordAPIError } from "discord.js";

export async function resolveError(filename: string, error: unknown) 
{
    const DiscordError = error as DiscordAPIError
    return console.log(`${filename}: ${DiscordError.code} - ${DiscordError.message}`)
}