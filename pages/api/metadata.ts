import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../collaborative/AuthAdapter"
import { parseMetadata } from "../../collaborative/helpers/pageMetadata"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end()

  const session = await getCustomSession({ req })

  if (!session?.discord || !session.google) return res.status(401).end()

  if (Array.isArray(req.query.url) || !req.query.url)
    return res.status(400).end()

  const url = req.query.url

  try {
    return res.json(await parseMetadata(url))
  } catch {
    return res.status(502).end()
  }
}
