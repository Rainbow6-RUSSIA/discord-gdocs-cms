import JWT from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO:
  // const session = await getCustomSession({ req })
  // if (!session?.google) return res.status(401).end()

  // const {
  //   email,
  //   given_name: firstName,
  //   family_name: lastName,
  //   sub,
  // } = session.google

  // const token = JWT.sign(
  //   { email, firstName, lastName },
  //   process.env.PRIVATE_KEY!,
  //   {
  //     algorithm: "RS256",
  //     keyid: "defaultkeyid",
  //     audience: "Convergence",
  //     subject: sub,
  //     expiresIn: "1h",
  //   },
  // )

  // return res.send(token)
}