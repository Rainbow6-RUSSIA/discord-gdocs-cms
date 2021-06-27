import type { Session as DBSession, Prisma } from "@prisma/client"
import { prisma } from "../prisma"

export class Session implements DBSession {
    id!: string
    userId!: string
    expires!: Date
    sessionToken!: string
    accessToken!: string
    createdAt!: Date
    updatedAt!: Date

    static async delete(where: Prisma.SessionWhereUniqueInput) {
        return prisma.session.delete({ where })
    }
}