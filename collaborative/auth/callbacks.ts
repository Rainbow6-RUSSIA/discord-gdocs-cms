/* eslint-disable require-atomic-updates */
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { Account, prisma, User } from "../db";
import { getDiscordProfile } from "../helpers/discord"
import { getGoogleProfile } from "../helpers/google"
import { providers } from "./providers"

const rotateToken = async (account: Account) => {
    const provider = providers.find(p => p.id === account.providerId)

    try {
        if (
            provider &&
            account.refreshToken &&
            account.accessTokenExpires &&
            account.accessTokenExpires.valueOf() < Date.now() + 5000
        ) {
            const res = await fetch(provider.accessTokenUrl, {
                method: "POST",
                body: new URLSearchParams({
                    client_id: provider.clientId,
                    client_secret: provider.clientSecret as string,
                    refresh_token: account.refreshToken,
                    grant_type: "refresh_token",
                }),
            })
            const raw = await res.json()
            account.accessToken = raw.access_token
            account.accessTokenExpires = new Date(
                Date.now() + (raw.expires_in ?? 3600) * 1000,
            )
            await prisma.account.update({
                data: account,
                where: {
                    providerId_providerAccountId: account
                }
            })
        }
    } catch (error) {
        console.log("SESSION", error)
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
            ...session,
            id: user.id as string,
            accounts: []
        }

        const accounts = await getRefreshedAccount(session.id)
        const google = accounts.find(a => a.providerId === "google")
        const discord = accounts.find(a => a.providerId === "discord")

        if (discord?.accessToken) {
            try {
                const discordUser = await getDiscordProfile(discord.accessToken)
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
                    await discord.remove()
                }
            }
        }

        if (google?.accessToken) {
            try {
                const googleUser = await getGoogleProfile(google.accessToken)
                session.accounts.push({
                    ...googleUser,
                    type: "google",
                    id: googleUser.sub,
                    avatar: googleUser.picture,
                })
            } catch (error) {
                console.log("Profile error", error)
                if (error.message.includes("Invalid Credentials")) {
                    await google.remove()
                }
            }
        }

        return session
    },
}

export { callbacks }