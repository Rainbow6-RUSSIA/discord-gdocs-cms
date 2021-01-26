import { google } from "googleapis"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"
import { getAuthClient } from "../../../collaborative/helpers/google";

const drive = google.drive("v3");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()

    const { accessToken, email } = session.google

    google.options({ auth: getAuthClient(accessToken) })

    const list = await drive.files.list({ q: `"${email}" in writers`, fields: "files(id, name)" })
  
    return res.send(list.data.files ?? [])
  }