
import Providers from "next-auth/providers"

const googleConfig = {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline",
    scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets",
}

const discordConfig = {
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    scope: "identify email guilds",
}

const providers = [
    Providers.Google(googleConfig),
    Providers.Discord(discordConfig),
]

export { providers }