import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"
import { SheetORM } from "../../../collaborative/sheet/orm"
import type { PostInstance } from "../../../collaborative/sheet/post"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
    if (typeof req.query.spreadsheetId !== "string" || typeof req.query.channelId !== "string") return res.status(400).end()

    const { accessToken } = session.google

    const orm = new SheetORM({ spreadsheetId: req.query.spreadsheetId, channelId: req.query.channelId, token: accessToken, validate: false })
    await orm.init()

    const data = await orm.getPosts()
    console.log(data)

    return res.send({ data, meta: { channelSheetId: orm.config.channelSheetId, postSheetId: orm.config.postSheetId }} as PostsAPIResponce)
  }

export type PostsAPIResponce = { data: PostInstance[], meta: { channelSheetId: number, postSheetId: number } }