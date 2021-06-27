import type { Account as DBAccount } from "@prisma/client"
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
}