import { GoogleSpreadsheet } from "google-spreadsheet"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCustomSession } from "../../../collaborative/AuthAdapter"
import type { CustomSession } from "../../../collaborative/types"

type HandlerFn<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: CustomSession,
) => Promise<T>

const getDocument: HandlerFn<GoogleSpreadsheet> = async (req, res, session) => {
  const doc = new GoogleSpreadsheet(req.body.spreadsheetId)
  doc.useRawAccessToken(session.google!.accessToken)
  await doc.loadInfo()
  
  return doc
}

const handlerGet: HandlerFn = async (req, res, session) => {
  return res.status(200).end()
}

const handlerPost: HandlerFn = async (req, res, session) => {
  const doc = await getDocument(req, res, session)
  await doc.updateProperties({ title: "renamed doc" })
  const sheet = doc.sheetsByIndex[0]
  await sheet.addRow(["Larry Page", "larry@google.com", "IT'S WORKING"])

  return res.status(200).end()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getCustomSession({ req })
  if (/* !session?.discord ||  */!session?.google) return res.status(401).end()

  //   let parsedBody = {}
  //   try {
  //     parsedBody = JSON.parse(req.body);
  //     } catch  {/* */}
  //     // eslint-disable-next-line require-atomic-updates
  //     req.body = parsedBody;

  switch (req.method) {
    case "GET":
      return handlerGet(req, res, session)
    case "POST":
      return handlerPost(req, res, session)
    default:
      return res.status(405).end()
  }
}
