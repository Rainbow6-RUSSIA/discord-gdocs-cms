import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { Account, User } from "../../../../../collaborative/db"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end()

  // console.log(await getCsrfToken({ req }))

  const session = await getSession({ req })
  const { providerId } = req.query

  try {
    if (!session) return res.status(401).end()
    const account = session.accounts.find(a => a.type === providerId)
    if (!account) return res.status(404).end()
    await Account.unlink({ providerAccountId: account.id, providerId: account.type })

    if (session.accounts.length === 1) {
      await User.clearSessions(session.id)
      await User.delete({ id: session.id })

      return res.status(204).end()
    }

    return res.status(200).end()

  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
