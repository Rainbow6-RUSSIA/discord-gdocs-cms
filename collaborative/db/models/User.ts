import type { User as DBUser } from "@prisma/client"
import type { IncomingMessage } from "http"
import { getSession } from "next-auth/client";
import { prisma } from "../prisma"

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
                            accessToken: session.accessToken as string,
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
}