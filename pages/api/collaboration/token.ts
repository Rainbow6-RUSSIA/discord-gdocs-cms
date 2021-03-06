import JWT from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  const account = session.accounts.sort((a, b) => a.type.localeCompare(b.type))[0]

  const token = JWT.sign(
    {
      email: account.email,
      firstName: account.name,
      lastName: account.type
    },
    process.env.PRIVATE_KEY!,
    {
      algorithm: "RS256",
      keyid: "defaultkeyid",
      audience: "Convergence",
      subject: session.id,
      expiresIn: "6h",
    },
  )

  return res.send(token)
}
