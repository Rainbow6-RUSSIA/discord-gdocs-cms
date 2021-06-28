import NextAuth from "next-auth"
import { callbacks } from "../../../collaborative/auth/callbacks"
import { providers } from "../../../collaborative/auth/providers"
import { adapter } from "../../../collaborative/db"

export default NextAuth({
  providers,
  adapter,
  callbacks,
  logger: {
    error: (errorCode, ...text) => {
      if (["SIGNOUT_ERROR", "PRISMA__DELETE_SESSION_ERROR"].includes(errorCode)) return
      console.log(errorCode, ...text)
    },
    // eslint-disable-next-line no-underscore-dangle
    debug: process.env._NEXTAUTH_DEBUG ? console.debug : () => { },
    warn: console.warn
  }
})