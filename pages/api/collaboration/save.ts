import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"
import { validateQuery } from "../../../collaborative/helpers/validateQuery"
import { SheetORM } from "../../../collaborative/sheet/orm"
import type { MessageInstance } from "../../../collaborative/sheet/post"

const query = ["spreadsheetId", "channelId", "postId"] as const

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO:
  // const session = await getCustomSession({ req })
  // if (!session?.google) return res.status(401).end()
  // if (!validateQuery(req.query, query)) return res.status(400).end()

  // const { accessToken } = session.google

  // const orm = new SheetORM({
  //   spreadsheetId: req.query.spreadsheetId,
  //   channelId: req.query.channelId,
  //   postId: req.query.postId,
  //   token: accessToken,
  //   validate: false,
  // })
  // await orm.init()

  // await orm.savePost(req.body as MessageInstance)

  return res.status(200).end()
}

export type SaveAPIQuery = typeof query[number]
