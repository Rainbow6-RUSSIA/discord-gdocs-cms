import { BotClient } from "../bot"
import type { DiscordPartialGuild, DiscordProfile } from "../types"

export const getDiscordGuilds = async (token: string) => {
  const guilds = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  ).then(async d => d.json())

  if ("message" in guilds) throw new Error(guilds.message)

  return guilds.map((g: DiscordPartialGuild) => ({
    ...g,
    isBotPresent: BotClient.guilds.cache.has(g.id),
  }))
}
