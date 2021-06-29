import type { Account as DBAccount, Prisma } from "@prisma/client"
import { providers } from "../../auth/providers"
import type { DiscordProfile, GoogleProfile } from "../../types"
import { prisma } from "../prisma"

export class Account implements DBAccount {
    id!: string
    userId!: string
    providerType!: string
    providerId!: string
    providerAccountId!: string
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

    static async rotateToken(account: Account): Promise<Account> {
        const provider = providers.find(p => p.id === account.providerId)

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

            Object.assign(account, {
                accessToken: raw.access_token,
                accessTokenExpires: new Date(
                    Date.now() + (raw.expires_in ?? 3600) * 1000,
                )
            })

            const { providerId, providerAccountId } = account
            return await prisma.account.update({
                data: account,
                where: {
                    providerId_providerAccountId: { providerId, providerAccountId }
                }
            })
        }

        return account
    }

    // static async getDiscordProfile(account: Account): Promise<DiscordProfile | null> {
    //     if (account.providerId !== "discord") return null

    //     if (!account.cachedProfile
    //         || !account.cachedAt
    //         || account.cachedAt.valueOf() < Date.now() - Number.parseInt(process.env.PROFILE_CACHE_LIFETIME ?? "3600") * 1000
    //     ) {

    //     }

    // }

    // static async getGoogleProfile(account: Account): Promise<GoogleProfile | null> {
    //     if (account.providerId !== "google") return null
    // }
}