import type { User as DBUser, Prisma } from "@prisma/client"
import type { IncomingMessage } from "http"
import { getSession } from "next-auth/client"
import { prisma } from "../prisma"
import type { Session } from "./Session"

export class User implements DBUser {
    id!: string;
    name!: string;
    email!: string;
    emailVerified!: Date;
    image!: string;
    createdAt!: Date;
    updatedAt!: Date;

    static async getCurrentUser(req: IncomingMessage) {
        const session = await getSession({ req })

        if (!session) return null

        const user = await prisma.user.findFirst({
            where: {
                sessions: {
                    some: {
                        AND: {
                            accessToken: session.accessToken,
                            expires: {
                                gt: new Date()
                            }
                        }
                    }
                }
            }
        })

        return user
    }

    static async delete(where: Prisma.UserWhereUniqueInput) {
        return prisma.user.delete({ where })
    }

    static async clearSessions(userId: User["id"]) {
        return prisma.session.deleteMany({ where: { userId } })
    }

    static async clearAnotherSessions(userId: User["id"], accessToken: Session["accessToken"]) {
        return prisma.session.deleteMany({
            where: {
                AND: {
                    userId,
                    NOT: { accessToken }
                }
            }
        })
    }
}