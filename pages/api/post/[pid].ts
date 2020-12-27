import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"
import type { CustomSession } from "../../../collaborative/types"

const handlerGet = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: CustomSession,
) => {
  return res.status(200).end()
}

const handlerPost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: CustomSession,
) => {
  return res.status(200).end()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.query.pid) return res.status(400).end()

  const session = await getCustomSession({ req })
  if (!session?.discord || !session.google) return res.status(401).end()

  switch (req.method) {
    case "GET":
      return handlerGet(req, res, session)
    case "POST":
      return handlerPost(req, res, session)
    case "PATCH":
    case "DELETE":
    default:
      return res.status(405).end()
  }
}
