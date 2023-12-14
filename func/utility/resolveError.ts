import { DiscordAPIError } from "discord.js";

/**
 * Logs the filename, error code, and error message to the console.
 * 
 * @param {string} filename - The name of the file where the error occurred.
 * @param {unknown} error - The error object that occurred.
 * @returns {void}
 */
export async function resolveError(filename: string, error: unknown) 
{
    const DiscordError = error as DiscordAPIError
    return console.log(`${filename}: ${DiscordError.code} - ${DiscordError.message}`)
}