import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { providerId } = req.query

  try {
    throw new Error("Not implemented")
    // const account = session?.accounts.find(a => a.type === providerId)
    // if (req.method === "POST" && session && account) {
    //   const accs = await Account.find({
    //     where: {
    //       userId: session.id,
    //     },
    //   })
    //   const accToDelete = accs.find(
    //     a => a.providerId === providerId && a.providerAccountId === account.id,
    //   )

    //   await accToDelete?.remove()

    //   if (accToDelete && accs.length === 1) {
    //     await User.delete({ id: session.id })
    //     await Session.delete({ sessionToken: session.accessToken })
    //     return res.status(204).end()
    //   }

    //   return res.status(200).end()
    // }
    // throw ""
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
