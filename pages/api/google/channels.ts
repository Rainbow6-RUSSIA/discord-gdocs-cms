import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/helpers/AuthAdapter"
import type { ChannelInstance } from "../../../collaborative/sheet/channel"
import { SheetORM } from "../../../collaborative/sheet/orm"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()
    if (Array.isArray(req.query.spreadsheetId)) return res.status(400).end()

    const { accessToken } = session.google

    const orm = new SheetORM({ spreadsheetId: req.query.spreadsheetId, token: accessToken, validate: false })
    await orm.init()

    const data = await orm.getChannels()
    console.log(data)

    return res.send({ data, meta: { channelSheetId: orm.config.channelSheetId }} as ChannelsAPIResponce)
  }

export type ChannelsAPIResponce = { data: ChannelInstance[], meta: { channelSheetId: number } }