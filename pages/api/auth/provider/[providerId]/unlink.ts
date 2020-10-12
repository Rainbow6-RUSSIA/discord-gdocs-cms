import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { Account } from "../../../../../modules/models/Account"
import { Session } from "../../../../../modules/models/Session"
import { User } from "../../../../../modules/models/User"
import type { CustomSession } from "../../../../../types"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = ((await getSession({
    req,
  })) as unknown) as CustomSession | null
  const { providerId } = req.query

  try {
    if (
      req.method === "POST" &&
      (providerId === "discord" || providerId === "google") &&
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
          a.providerAccountId ===
            (providerId === "discord"
              ? session.discord!.id
              : session.google!.sub),
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
