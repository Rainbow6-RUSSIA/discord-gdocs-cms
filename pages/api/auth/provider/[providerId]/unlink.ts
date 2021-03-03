import type { NextApiRequest, NextApiResponse } from "next"
import { Account } from "../../../../../collaborative/auth/models/Account"
import { Session } from "../../../../../collaborative/auth/models/Session"
import { User } from "../../../../../collaborative/auth/models/User"
import { getCustomSession } from "../../../../../collaborative/auth/session"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getCustomSession({ req })
  const { providerId } = req.query

  try {
    const account = session?.accounts.find(a => a.type === providerId)
    if (req.method === "POST" && session && account) {
      const accs = await Account.find({
        where: {
          userId: session.id,
        },
      })
      const accToDelete = accs.find(
        a => a.providerId === providerId && a.providerAccountId === account.id,
      )

      await accToDelete?.remove()

      if (accToDelete && accs.length === 1) {
        await User.delete({ id: session.id })
        await Session.delete({ sessionToken: session.accessToken })
        return res.status(204).end()
      }

      return res.status(200).end()
    }
    throw ""
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
