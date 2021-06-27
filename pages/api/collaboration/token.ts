import JWT from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import type { GoogleUser } from "../../../collaborative/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).end()
  const google = session.accounts.find((a): a is GoogleUser => a.type === "google");
  if (!google) return res.status(401).end()

  const {
    email,
    given_name: firstName,
    family_name: lastName,
    sub,
  } = google

  const token = JWT.sign(
    { email, firstName, lastName },
    process.env.PRIVATE_KEY!,
    {
      algorithm: "RS256",
      keyid: "defaultkeyid",
      audience: "Convergence",
      subject: sub,
      expiresIn: "1h",
    },
  )

  return res.send(token)
}
