import NextAuth from "next-auth"
import { callbacks } from "../../../collaborative/auth/callbacks"
import { providers } from "../../../collaborative/auth/providers"
import { adapter } from "../../../collaborative/db"

export default NextAuth({
  providers,
  adapter,
  callbacks
})