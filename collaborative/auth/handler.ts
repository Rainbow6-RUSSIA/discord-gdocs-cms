/* eslint-disable require-atomic-updates */
import type { InitOptions } from "next-auth"
import type { SessionBase } from "next-auth/_utils"
import Providers from "next-auth/providers"
import { getGoogleProfile } from "../helpers/google"
import type { CustomSession, GoogleProfile } from "../types"
import { Adapter } from "./adapter"
import { Account } from "./models/Account"
import type { User } from "./models/User"

const googleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorizationUrl:
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline",
  scope:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets",
}

const adapter = Adapter(process.env.DATABASE_URL!)

const providers = [Providers.Google(googleConfig)]

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
          client_secret: provider.clientSecret,
          refresh_token: account.refreshToken,
          grant_type: "refresh_token",
        }),
      })
      const raw = await res.json()
      account.accessToken = raw.access_token
      account.accessTokenExpires = new Date(
        Date.now() + (raw.expires_in ?? 3600) * 1000,
      )
      await account.save()
    }
  } catch (error) {
    console.log("SESSION", error)
  }

  return account
}

const getRefreshedAccount = async (userId: string) => {
  const accounts: Account[] = await Account.find({
    where: { userId },
  })

  return Promise.all(accounts.map(rotateToken))
}

export const options = {
  callbacks: {
    session: async (session: SessionBase, user: User) => {
      const sessionObj: CustomSession = {
        id: user.id,
        accessToken: session.accessToken!,
        expires: session.expires,
        // discord: null,
        google: null,
      }

      const accounts = await getRefreshedAccount(user.id)
      const google = accounts.find(a => a.providerId === "google")
      // const discord = accounts.find(a => a.providerId === "discord")

      if (google?.accessToken) {
        try {
          const googleUser = await getGoogleProfile(google.accessToken)
          sessionObj.google = googleUser
          sessionObj.google.accessToken = google.accessToken
        } catch (error) {
          console.log("Profile error", error)
          if (error.message.includes("Invalid Credentials")) {
            await google.remove()
            return {}
          }
        }
      } else {
        console.log("Account not linked")
      }

      return sessionObj
    },
  },

  providers,
  adapter,
} as InitOptions
