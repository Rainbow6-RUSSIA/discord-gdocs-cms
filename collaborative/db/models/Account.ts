import { Account as DBAccount, AccountProvider, Prisma } from "@prisma/client"
import { providers } from "../../auth/providers"
import { getDiscordGuilds } from "../../helpers/discord"
import type { DiscordProfile, GoogleProfile } from "../../types"
import { prisma } from "../prisma"

export class Account implements DBAccount {
    id!: string
    userId!: string
    providerAccountId!: string
    providerType!: "oauth"
    providerId!: AccountProvider
    refreshToken!: string | null
    accessToken!: string | null
    accessTokenExpires!: Date | null
    createdAt!: Date
    updatedAt!: Date
    cachedProfile!: Prisma.JsonValue | null
    cachedAt!: Date | null

    static async unlink(
        { providerAccountId, providerId }:
            Pick<Account, "providerId" | "providerAccountId">
    ) {
        return prisma.account.delete({
            where: {
                providerId_providerAccountId: { providerAccountId, providerId }
            }
        })
    }

    static async update(
        account: Pick<Account, "providerId" | "providerAccountId"> & Partial<Account>
    ) {
        const { providerAccountId, providerId } = account
        return prisma.account.update({
            data: account,
            where: {
                providerId_providerAccountId: { providerAccountId, providerId }
            }
        })
    }

    static async rotateToken(account: Account): Promise<Account> {
        const provider = providers.find(p => p.id === account.providerId)

        if (
            provider &&
            account.refreshToken &&
            Number(account.accessTokenExpires) < Date.now() + 5000
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

            Object.assign(account, {
                accessToken: raw.access_token,
                accessTokenExpires: new Date(
                    Date.now() + (raw.expires_in ?? 3600) * 1000,
                )
            })

            return await Account.update(account)
        }

        return account
    }

    static async getDiscordProfile(account: Account): Promise<DiscordProfile> {
        if (!account.accessToken) throw new Error("No token")
        if (!Account.isDiscordAccount(account)) throw new Error(`Not a discord account, got ${account.providerId}`)
        if (!Account.isProfileCacheValid(account)) {
            const discordUser = await fetch("https://discord.com/api/users/@me", {
                headers: { Authorization: `Bearer ${account.accessToken}` },
            }).then(async d => d.json())

            if ("message" in discordUser) throw new Error(discordUser.message)

            discordUser.guilds = await getDiscordGuilds(account.accessToken)

            Object.assign(account, {
                cachedProfile: discordUser,
                cachedAt: new Date()
            })

            await Account.update(account)
        }
        return account.cachedProfile!
    }

    static async getGoogleProfile(account: Account): Promise<GoogleProfile> {
        if (!account.accessToken) throw new Error("No token")
        if (!Account.isGoogleAccount(account)) throw new Error(`Not a google account, got ${account.providerId}`)
        if (!Account.isProfileCacheValid(account)) {
            const googleUser = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${account.accessToken}` },
            }).then(async d => d.json())
            if ("error" in googleUser) throw new Error(googleUser.error_description)

            Object.assign(account, {
                cachedProfile: googleUser,
                cachedAt: new Date()
            })

            await Account.update(account)
        }
        return account.cachedProfile!
    }

    static isProfileCacheValid({ cachedProfile, cachedAt }: Account) {
        return Boolean(
            cachedProfile
            && cachedAt
            && cachedAt.valueOf() > Date.now() - Number.parseInt(process.env.PROFILE_CACHE_LIFETIME ?? "3600") * 1000
        )
    }

    static isDiscordAccount(account: Account): account is (Account & { cachedProfile: DiscordProfile | null }) {
        return account.providerId === AccountProvider.discord
    }

    static isGoogleAccount(account: Account): account is (Account & { cachedProfile: GoogleProfile | null }) {
        return account.providerId === AccountProvider.google
    }
}