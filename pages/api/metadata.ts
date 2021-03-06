import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"
import { parseMetadata } from "../../collaborative/helpers/pageMetadata"
import { validateQuery } from "../../collaborative/helpers/validateQuery"

const query = ["url"] as const

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end()

  const session = await getSession({ req })

  if (!session) return res.status(401).end()

  if (!validateQuery(req.query, query)) return res.status(400).end()

  const url = req.query.url

  try {
    return res.json(await parseMetadata(url))
  } catch {
    return res.status(502).end()
  }
}

export type MetadataAPIQuery = typeof query[number]
