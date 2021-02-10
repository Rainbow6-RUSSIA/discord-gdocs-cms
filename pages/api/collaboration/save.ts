import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"
import { SheetORM } from "../../../collaborative/sheet/orm"
import type { EditorManagerLike } from "../../../modules/editor/EditorManager"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
    if (
        typeof req.query.spreadsheetId !== "string" ||
        typeof req.query.channelId !== "string" ||
        typeof req.query.postId !== "string"
    )
        return res.status(400).end()

    const { accessToken } = session.google

    const orm = new SheetORM({
        spreadsheetId: req.query.spreadsheetId,
        channelId: req.query.channelId,
        postId: req.query.postId,
        token: accessToken,
        validate: true,
    })
    await orm.init()

    await orm.saveContent(req.body as EditorManagerLike)

    return res.status(200).end()
}
