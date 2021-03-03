import { BotClient } from "../bot"
import type { DiscordPartialGuild, DiscordProfile } from "../types"

export const getDiscordProfile = async (
  token: string,
): Promise<DiscordProfile> => {
  const discordUser = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async d => d.json())

  const discordGuilds = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  ).then(async d => d.json())

  if ("message" in discordUser) throw new Error(discordUser.message)
  if ("message" in discordGuilds) throw new Error(discordGuilds.message)

  discordUser.guilds = discordGuilds.map((g: DiscordPartialGuild) => ({
    ...g,
    isBotPresent: BotClient.guilds.cache.has(g.id),
  }))

  return discordUser
}
