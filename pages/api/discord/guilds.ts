import type { GuildChannel, Emoji, Guild, Role } from "discord.js"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../modules/AuthAdapter"
import { BotClient } from "../../../modules/bot"

export type Responce = {
  // guild: SubType<Guild, string | null | number | boolean | Array<string> >,
  guild: Guild
  roles: Role[]
  channels: GuildChannel[]
  emojis: Emoji[]
}[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end()

  const session = await getCustomSession({ req })

  if (!session?.discord) return res.status(401).end()

  const guilds = new Set(session.discord.guilds.map(g => g.id))

  return res.send(
    BotClient.guilds.cache
      .filter(g => guilds.has(g.id))
      .map((g): Responce[0] => ({
        channels: g.channels.cache.array(),
        emojis: g.emojis.cache.array(),
        guild: g,
        roles: g.roles.cache.array(),
      })),
  )
}
