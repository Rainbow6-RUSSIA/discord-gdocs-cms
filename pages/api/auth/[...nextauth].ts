import type { NextApiRequest, NextApiResponse } from "next"
import nextAuth from "next-auth"
import type { AppOptions, InitOptions } from "next-auth"
import Adapters from "next-auth/adapters"
import Providers from "next-auth/providers"
import type { ConnectionOptions } from "typeorm"
import Models from "../../../modules/models"

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

const adapter = Adapters.TypeORM.Adapter(process.env.DATABASE_URL as ConnectionOptions , { models: Models })

const options: InitOptions = {
    callbacks: {
        session: async (session, user) => {
            // const {  } = await adapter.getAdapter({} as AppOptions);
            // // console.log("Session", session, user)
            // console.log(await getUser(user.id));
            const sessionObj = {
                id: user.id,
                accessToken: session.accessToken,
                expires: session.expires,
                google: {},
                discord: {},
            }
            return sessionObj
        },
        // signIn: async (user, account, profile) => {
        //     console.log("SignIn", user, account, profile)
        //     return true
        // }
    },

    providers: [
        Providers.Discord(discordConfig),
        Providers.Google(googleConfig),
    ],

    // database: process.env.DATABASE_URL,
    adapter,
}

export default async (req: NextApiRequest, res: NextApiResponse) => nextAuth(req, res, options)