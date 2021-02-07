import { google } from "googleapis"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/auth/session"
import { getAuthClient } from "../../../collaborative/helpers/google";
import type { SpreadsheetItem } from "../../../collaborative/types";

const drive = google.drive("v3");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const session = await getCustomSession({ req })
    if (!session?.google) return res.status(401).end()

    const { accessToken, email } = session.google

    google.options({ auth: getAuthClient(accessToken) })

    const list = await drive.files.list({
      q: `createdTime > '2020-09-01' and mimeType = "application/vnd.google-apps.spreadsheet" and "${email}" in writers`,
      includeItemsFromAllDrives: true,
      includeTeamDriveItems: true,
      supportsAllDrives: true,
      supportsTeamDrives: true,
      fields: "files(id, name, starred)"
    })
  
    return res.send({ data: list.data.files ?? [] } as SpreadsheetsAPIResponce)
  }

export type SpreadsheetsAPIResponce = { data: SpreadsheetItem[] }