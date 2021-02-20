import { GoogleSpreadsheet } from "google-spreadsheet"
import { Auth } from "googleapis"
import type { GoogleProfile } from "../types"

export async function getDocument(token: string, docId: string) {
  const doc = new GoogleSpreadsheet(docId)
  doc.useRawAccessToken(token)
  await doc.loadInfo()
  // const sheet = doc.sheetsByIndex[0];
  return doc
}

export const getGoogleProfile = async (
  token: string,
): Promise<GoogleProfile> => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if ("error" in json) {
    throw new Error(json.error_description)
  }
  return json
}

export const getAuthClient = (access_token: string) => {
  const authClient = new Auth.OAuth2Client()
  authClient.setCredentials({ access_token })
  return authClient
}
