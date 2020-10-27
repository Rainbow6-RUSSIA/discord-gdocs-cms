import type { NextApiRequest, NextApiResponse } from "next"
import nextAuth from "next-auth"
import type { InitOptions } from "next-auth"
import type { SessionBase } from "next-auth/_utils"
import type { Adapter as IAdapter } from "next-auth/adapters"
import Providers from "next-auth/providers"
import { Adapter } from "../../../modules/AuthAdapter"
import { BotClient } from "../../../modules/bot"
import { Account } from "../../../modules/models/Account"
import type { User } from "../../../modules/models/User"
import type {
  CustomSession,
  DiscordPartialGuild,
  DiscordProfile,
  GoogleProfile,
} from "../../../types"

const discordConfig = {
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  scope: "identify guilds",
}

const googleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
}

const adapter = (Adapter(process.env.DATABASE_URL!) as unknown) as IAdapter // сука кривые типы

const options = {
  callbacks: {
    session: async (session: SessionBase, user: User) => {
      const sessionObj: CustomSession = {
        id: user.id,
        accessToken: session.accessToken!,
        expires: session.expires,
        discord: null,
        google: null,
      }

      const accounts: Account[] = await Account.find({
        where: { userId: user.id },
      })
      const google = accounts.find(a => a.providerId === "google")
      const discord = accounts.find(a => a.providerId === "discord")

      if (google) {
        const googleUser: GoogleProfile & {
          error: string
        } = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${google.accessToken}` },
        }).then(d => d.json())
        if (googleUser.error) {
          await google.remove()
        } else {
          sessionObj.google = googleUser
          sessionObj.google.accessToken = google.accessToken!
        }
      }
      if (discord) {
        const discordUser: DiscordProfile & { message: string } = await fetch(
          "https://discord.com/api/users/@me",
          {
            headers: { Authorization: `Bearer ${discord.accessToken}` },
          },
        ).then(d => d.json())

        const discordGuilds: DiscordPartialGuild[] = await fetch(
          "https://discord.com/api/users/@me/guilds",
          {
            headers: { Authorization: `Bearer ${discord.accessToken}` },
          },
        ).then(d => d.json())

        if (discordUser.message) {
          await discord.remove()
        } else {
          sessionObj.discord = discordUser
          sessionObj.discord.guilds = Array.isArray(discordGuilds)
            ? discordGuilds.map(g => ({
                ...g,
                isBotPresent: BotClient.guilds.cache.has(g.id),
              }))
            : []
        }
      }

      return sessionObj
    },
  },

  providers: [Providers.Discord(discordConfig), Providers.Google(googleConfig)],
  adapter,
}

export default async (req: NextApiRequest, res: NextApiResponse) =>
  nextAuth(req, res, options as unknown as InitOptions)
