import type { NextApiRequest, NextApiResponse } from "next"
import nextAuth, { InitOptions } from "next-auth"
import type { GenericObject } from "next-auth/_utils"
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
            console.log("JWT", token, account, profile)
            /* switch (account?.provider) {
                case "discord": {
                    const res: GenericObject = {
                        google: token.google,
                        discord: {
                            id: account.id,
                            tag: `${profile.username}#${profile.discriminator}`,
                            av: token.image,
                            accessToken: account.accessToken
                        }
                    }        
                    return Promise.resolve(res)
                }
                case "google": {
                    const res: GenericObject = {
                        discord: token.discord,
                        google: {
                            name: profile.name,
                            email: profile.email,
                            av: token.image,
                            accessToken: account.accessToken
                        }
                    }        
                    return Promise.resolve(res)
                }

            } */
            return Promise.resolve(token)
        }
    },
    // database: process.env.DATABASE_URL
}

export default async (req: NextApiRequest, res: NextApiResponse) => nextAuth(req, res, options)