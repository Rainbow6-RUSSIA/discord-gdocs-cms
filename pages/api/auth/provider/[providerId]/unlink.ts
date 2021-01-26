import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../../../collaborative/AuthAdapter"
import { Account } from "../../../../../collaborative/models/Account"
import { Session } from "../../../../../collaborative/models/Session"
import { User } from "../../../../../collaborative/models/User"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getCustomSession({ req })
  const { providerId } = req.query

  try {
    if (
      req.method === "POST" &&
      providerId === "google" &&
      session &&
      session[providerId]
    ) {
      const accs = await Account.find({
        where: {
          userId: session.id,
        },
      })
      const accToDelete = accs.find(
        a =>
          a.providerId === providerId &&
          a.providerAccountId === session.google!.sub
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
  } catch {
    return res.status(404).end()
  }
}
