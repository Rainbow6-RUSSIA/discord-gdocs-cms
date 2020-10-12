import type { NextApiRequest, NextApiResponse } from "next"
import { parseMetadata } from "../../modules/markdown/helpers/pageMetadata"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end()

  if (Array.isArray(req.query.url) || !req.query.url)
    return res.status(400).end()

  const url = req.query.url

  try {
    return res.json(await parseMetadata(url))
  } catch {
    return res.status(502).end()
  }
}
