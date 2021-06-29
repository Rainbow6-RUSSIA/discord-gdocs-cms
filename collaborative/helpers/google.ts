import { GoogleSpreadsheet } from "google-spreadsheet"
import { Auth } from "googleapis"

export async function getDocument(token: string, docId: string) {
  const doc = new GoogleSpreadsheet(docId)
  doc.useRawAccessToken(token)
  await doc.loadInfo()
  // const sheet = doc.sheetsByIndex[0];
  return doc
}

export const getAuthClient = (access_token: string) => {
  const authClient = new Auth.OAuth2Client()
  authClient.setCredentials({ access_token })
  return authClient
}
