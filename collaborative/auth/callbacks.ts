/* eslint-disable require-atomic-updates */
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { Account, prisma, User } from "../db"
import { getDiscordProfile } from "../helpers/discord"
import { getGoogleProfile } from "../helpers/google"

const rotateToken = async (account: Account) => {
    try {
        return await Account.rotateToken(account)
    } catch (error) {
        console.log("ROTATE TOKEN", error)
    }

    return account
}

const getRefreshedAccount = async (userId: string) => {
    const accounts: Account[] = await prisma.account.findMany({
        where: { userId },
    })

    return Promise.all(accounts.map(rotateToken))
}

const callbacks = {
    session: async (session: Session, user: JWT | User) => {
        session = {
            id: user.id as string,
            accounts: [],
            accessToken: session.accessToken,
            expires: session.expires
        }

        const accounts = await getRefreshedAccount(session.id)
        const google = accounts.find(a => a.providerId === "google")
        const discord = accounts.find(a => a.providerId === "discord")

        if (discord?.accessToken) {
            try {
                const discordUser = await getDiscordProfile(discord.accessToken) // TODO: cache profile to avoid ratelimit
                const avatarPath = discordUser.avatar
                    ? `avatars/${discordUser.id}/${discordUser.avatar}.${discordUser.avatar.startsWith("a_") ? "gif" : "png"
                    }`
                    : `embed/avatars/${Number.parseInt(discordUser.discriminator, 10) % 5
                    }.png`

                session.accounts.push({
                    ...discordUser,
                    type: "discord",
                    name: `${discordUser.username}#${discordUser.discriminator}`,
                    avatar: `https://cdn.discordapp.com/${avatarPath}`,
                })
            } catch (error) {
                console.log("Profile error", error)
                if (error.message.includes("Invalid Credentials")) {
                    await Account.unlink(discord)
                }
            }
        }

        if (google?.accessToken) {
            try {
                const googleUser = await getGoogleProfile(google.accessToken)  // TODO: cache profile to avoid ratelimit
                session.accounts.push({
                    ...googleUser,
                    type: "google",
                    id: googleUser.sub,
                    avatar: googleUser.picture,
                })
            } catch (error) {
                console.log("Profile error", error)
                if (error.message.includes("Invalid Credentials")) {
                    await Account.unlink(google)
                }
            }
        }
        return session
    },
}

export { callbacks }