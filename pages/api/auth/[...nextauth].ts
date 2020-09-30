import type { NextApiRequest, NextApiResponse } from "next"
import nextAuth, { InitOptions } from "next-auth"
import Providers from "next-auth/providers"

const discordConfig = {
    clientId: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    scope: "identify guilds"
}

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets"
}

console.log(discordConfig, googleConfig)

const options: InitOptions = {
    providers: [
        Providers.Discord(discordConfig),
        Providers.Google(googleConfig),
    ],
    callbacks: {
        session: async (session, user) => {
            console.log("Session", session, user)
            return Promise.resolve(session)
        },
        jwt: async (token, user, account, profile, isNewUser) => {
            console.log("JWT", token, user, account, profile, isNewUser)
            return Promise.resolve(token)
        }
    },
    // database: process.env.DATABASE_URL
}

export default async (req: NextApiRequest, res: NextApiResponse) => nextAuth(req, res, options)