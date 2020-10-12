import { Client } from "discord.js"

export const BotClient = new Client()

void BotClient.login(process.env.DISCORD_TOKEN)

if (process.env.NODE_ENV === "development") {
  BotClient.on("debug", console.log)
}
