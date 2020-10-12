/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { URL } from "url"
import { Connection, createConnection, getConnection } from "typeorm"
import type { AppOptions } from "next-auth"
import { Account } from "./models/Account"
import { Session } from "./models/Session"
import { User } from "./models/User"
import type { ConnectionOptions } from "typeorm"
import { getSession } from "next-auth/client"
import type { CustomSession } from "../types"

export let connection: Connection | null = null

export const Adapter = (typeOrmConfig: string) => {
  async function getAdapter(appOptions: AppOptions) {
    const url = new URL(typeOrmConfig)
    const config: ConnectionOptions = {
      type: "postgres",
      host: url.hostname,
      port: parseInt(url.port),
      username: url.username,
      password: url.password,
      database: url.pathname.split("/")[1],
      entities: [Account, Session, User],
      synchronize: process.env.NODE_ENV === "development",
    }

    try {
      connection = getConnection()
    } catch (err) {
      console.log("Getting new DB connection")
    }

    if (!connection?.isConnected) {
      connection = await createConnection(config)
    }

    if (process.env.NODE_ENV === "development") {
      //@ts-ignore
      connection.options.entities = config.entities
      //@ts-ignore
      connection.buildMetadatas()
      await connection.synchronize() // пиздец хак, чтобы при hot reload не отваливались сущности
    }

    const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000
    const sessionMaxAge =
      appOptions && appOptions.session && appOptions.session.maxAge
        ? appOptions.session.maxAge * 1000
        : defaultSessionMaxAge
    const sessionUpdateAge =
      appOptions && appOptions.session && appOptions.session.updateAge
        ? appOptions.session.updateAge * 1000
        : 0

    async function createUser() {
      return new User().save()
    }

    async function getUser(id: string) {
      return User.findOne({ where: { id } })
    }

    async function getUserByProviderAccountId(
      providerId: any,
      providerAccountId: any,
    ) {
      const account = await Account.findOne<Account>({
        where: { providerId, providerAccountId },
      })
      if (!account) {
        return null
      }
      return User.findOne({ where: { id: account.userId } })
    }

    async function updateUser(user: Partial<User>) {
      return new User(user).save()
    }

    async function deleteUser(userId: string) {
      // @TODO Delete user from DB
      return false
    }

    async function linkAccount(
      userId: any,
      providerId: any,
      providerType: any,
      providerAccountId: any,
      refreshToken: any,
      accessToken: any,
      accessTokenExpires: any,
    ) {
      return new Account({
        userId,
        providerId,
        providerType,
        providerAccountId,
        refreshToken,
        accessToken,
        accessTokenExpires,
      }).save()
    }

    async function unlinkAccount(
      userId: any,
      providerId: any,
      providerAccountId: any,
    ) {
      // @TODO Get current user from DB
      // @TODO Delete [provider] object from user object
      // @TODO Save changes to user object in DB
      return false
    }

    async function createSession(user: Partial<User>) {
      const dateExpires = new Date()
      dateExpires.setTime(dateExpires.getTime() + sessionMaxAge)
      const expires = dateExpires

      return new Session({ userId: user.id!, expires }).save()
    }

    async function getSession(sessionToken: string) {
      const session = await Session.findOne<Session>({
        where: { sessionToken },
      })

      // Check session has not expired (do not return it if it has)
      if (
        session &&
        session.expires &&
        new Date() > new Date(session.expires)
      ) {
        // @TODO Delete old sessions from database
        return null
      }

      return session
    }

    async function updateSession(
      session: Pick<Session, "userId" | "expires"> & Partial<Session>,
      force?: boolean,
    ) {
      if (
        sessionMaxAge &&
        (sessionUpdateAge || sessionUpdateAge === 0) &&
        session.expires
      ) {
        // Calculate last updated date, to throttle write updates to database
        // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
        //     e.g. ({expiry date} - 30 days) + 1 hour
        //
        // Default for sessionMaxAge is 30 days.
        // Default for sessionUpdateAge is 1 hour.
        const dateSessionIsDueToBeUpdated = new Date(session.expires)
        dateSessionIsDueToBeUpdated.setTime(
          dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge,
        )
        dateSessionIsDueToBeUpdated.setTime(
          dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge,
        )

        // Trigger update of session expiry date and write to database, only
        // if the session was last updated more than {sessionUpdateAge} ago
        if (new Date() > dateSessionIsDueToBeUpdated) {
          const newExpiryDate = new Date()
          newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge)
          session.expires = newExpiryDate
        } else if (!force) {
          return null
        }
      } else {
        // If session MaxAge, session UpdateAge or session.expires are
        // missing then don't even try to save changes, unless force is set.
        if (!force) {
          return null
        }
      }

      return new Session(session).save()
    }

    async function deleteSession(sessionToken: string) {
      if (sessionToken) {
        return Session.delete<Session>({ sessionToken })
      }
    }

    return Promise.resolve({
      createUser,
      getUser,
      getUserByProviderAccountId,
      updateUser,
      deleteUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSession,
      updateSession,
      deleteSession,

      getUserByEmail: () => {},
    })
  }

  return {
    getAdapter,
  }
}

export const getCustomSession = (getSession as unknown) as (
  ...args: Parameters<typeof getSession>
) => Promise<CustomSession | null | undefined>
