import type { Guild, GuildMember } from "discord.js"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"
import { BotClient } from "../../../collaborative/bot"

export type Responce = {
  guild: Guild
  members: GuildMember[]
}[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // if (req.method !== "GET") return res.status(405).end()

  // const session = await getCustomSession({ req })

  // if (!session?.discord) return res.status(401).end()

  // const guilds = new Set(session.discord.guilds.map(g => g.id))

  // return res.send(
  //   BotClient.guilds.cache
  //     .filter(g => guilds.has(g.id))
  //     .map((g): Responce[0] => ({
  //       guild: g,
  //       members: g.members.cache.array(),
  //     })),
  // )
}
