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

export const getDiscordProfile = async (
  token: string,
): Promise<DiscordProfile> => {
  const discordUser = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async d => d.json())

  if ("message" in discordUser) throw new Error(discordUser.message)

  discordUser.guilds = await getDiscordGuilds(token)

  return discordUser
}
