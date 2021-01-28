import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"
import { SheetORM } from "../../../collaborative/sheet"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
    if (!req.body) return res.status(400).end()

    const { accessToken } = session.google

    const orm = new SheetORM({ ...req.body, token: accessToken, validate: false })
    await orm.init()

    return res.send(await orm.getChannels())
  }