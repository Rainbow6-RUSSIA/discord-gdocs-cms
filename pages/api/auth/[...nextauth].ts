import type { NextApiRequest, NextApiResponse } from "next"
import nextAuth from "next-auth"
import type { InitOptions } from "next-auth"
import type { Adapter as IAdapter } from "next-auth/adapters"
import Providers from "next-auth/providers"
import { Adapter } from "../../../modules/Adapter"
import { Account } from "../../../modules/models/Account"

const discordConfig = {
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  scope: "identify guilds",
}

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets",
}

const adapter = (Adapter(process.env.DATABASE_URL!) as unknown) as IAdapter // сука кривые типы

const options: InitOptions = {
  callbacks: {
    session: async (session, user) => {
      const sessionObj = {
        id: user.id,
        accessToken: session.accessToken,
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
        sessionObj.google = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${google.accessToken}` } },
        ).then(d => d.json())
      }
      if (discord) {
        sessionObj.discord = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${discord.accessToken}` },
        }).then(d => d.json())
      }

      return sessionObj
    },
  },

  providers: [Providers.Discord(discordConfig), Providers.Google(googleConfig)],
  adapter,
}

export default async (req: NextApiRequest, res: NextApiResponse) =>
  nextAuth(req, res, options)
