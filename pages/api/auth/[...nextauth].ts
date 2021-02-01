/* eslint-disable require-atomic-updates */
import type { NextApiRequest, NextApiResponse } from "next"
import nextAuth from "next-auth"
import type { InitOptions } from "next-auth"
import type { SessionBase } from "next-auth/_utils"
import Providers from "next-auth/providers"
import { Adapter } from "../../../collaborative/helpers/AuthAdapter"
import { getGoogleProfile } from "../../../collaborative/helpers/google"
import { Account } from "../../../collaborative/models/Account"
import type { User } from "../../../collaborative/models/User"
import type { CustomSession, GoogleProfile } from "../../../collaborative/types"

const googleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline",
  scope:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets",
}

const adapter = Adapter(process.env.DATABASE_URL!)

const providers = [Providers.Google(googleConfig)]

const rotateToken = async (account: Account) => {
  const provider = providers.find(p => p.id === account.providerId)
  
  try {
    if (provider
      && account.refreshToken
      && account.accessTokenExpires
      && account.accessTokenExpires < new Date()) {
        const res = await fetch(provider.accessTokenUrl, {
          method: "POST",
          body: new URLSearchParams({
            client_id: provider.clientId,
            client_secret: provider.clientSecret,
            refresh_token: account.refreshToken,
            grant_type: "refresh_token"
          })
        })
        const raw = await res.json();
        account.accessToken = raw.access_token;
        account.accessTokenExpires = new Date(Date.now() + raw.expires_in * 1000)
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

  return Promise.all(accounts.map(rotateToken));
}

const options = {
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
        const googleUser = await getGoogleProfile(google.accessToken)
        if (googleUser.error) {
          await google.remove()
        } else {
          sessionObj.google = googleUser
          sessionObj.google.accessToken = google.accessToken
        }
      }

      return sessionObj
    },
  },

  providers,
  adapter,
}

export default async (req: NextApiRequest, res: NextApiResponse) =>
  nextAuth(req, res, (options as unknown) as InitOptions)
