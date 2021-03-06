import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

const adapter = PrismaAdapter(prisma)

export { adapter, prisma }
export { Account, User, Session } from "./models"
export * from "@prisma/client"