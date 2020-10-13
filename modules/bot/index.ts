import { Client } from "discord.js"

export const BotClient = new Client()

void BotClient.login(process.env.DISCORD_TOKEN)

BotClient.on("ready", () => {
  console.log(
    `Logged as ${BotClient.user?.tag} @ ${BotClient.guilds.cache.size} guilds`,
  )
})
