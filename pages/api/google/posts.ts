import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
  
    console.log(await req.body)
  
    return res.end()
  }