import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"
import { SheetORM } from "../../../collaborative/sheet"
import type { PostInstance } from "../../../collaborative/sheet/posts"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
    if (Array.isArray(req.query.spreadsheetId) || Array.isArray(req.query.channelId)) return res.status(400).end()

    const { accessToken } = session.google

    const orm = new SheetORM({ spreadsheetId: req.query.spreadsheetId, channelId: req.query.channelId, token: accessToken, validate: false })
    await orm.init()

    const posts = await orm.getPosts()
    console.log(posts)

    return res.send({ posts, meta: { channelSheetId: orm.config.channelSheetId, postSheetId: orm.config.postSheetId }} as PostsAPIResponce)
  }

export type PostsAPIResponce = { posts: PostInstance[], meta: { channelSheetId: number, postSheetId: number } }