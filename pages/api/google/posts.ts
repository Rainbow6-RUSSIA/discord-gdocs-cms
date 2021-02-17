import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"
import { validateQuery } from "../../../collaborative/helpers/validateQuery"
import { SheetORM } from "../../../collaborative/sheet/orm"
import type { PostInstance } from "../../../collaborative/sheet/post"

const query = ["spreadsheetId", "channelId"] as const

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
    if (!validateQuery(req.query, query))
        return res.status(400).end()

    const { accessToken } = session.google

    const orm = new SheetORM({
        spreadsheetId: req.query.spreadsheetId,
        channelId: req.query.channelId,
        token: accessToken,
        validate: false,
    })
    await orm.init()

    const data = await orm.getPosts()
    console.log(data)

    return res.send({
        data,
        meta: {
            channelSheetId: orm.config.channelSheetId,
            postSheetId: orm.config.postSheetId,
        },
    } as PostsAPIResponce)
}

export type PostsAPIQuery = typeof query[number]

export type PostsAPIResponce = {
    data: PostInstance[]
    meta: { channelSheetId: number; postSheetId: number }
}
