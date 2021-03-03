import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"
import { validateQuery } from "../../../collaborative/helpers/validateQuery"
import type { ChannelInstance } from "../../../collaborative/sheet/channel"
import { SheetORM } from "../../../collaborative/sheet/orm"

const query = ["spreadsheetId"] as const

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
  //   token: accessToken,
  //   validate: true,
  // })
  // await orm.init()

  // const data = await orm.getChannels()
  // console.log(data)

  // return res.send({
  //   data,
  //   meta: { channelSheetId: orm.config.channelSheetId },
  // } as ChannelsAPIResponce)
}

export type ChannelsAPIQuery = typeof query[number]

export type ChannelsAPIResponce = {
  data: ChannelInstance[]
  meta: { channelSheetId: number }
}
