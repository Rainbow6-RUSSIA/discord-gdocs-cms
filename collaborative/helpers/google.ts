
import { GoogleSpreadsheet } from "google-spreadsheet";
import fetch from "isomorphic-unfetch";
import type { GoogleProfile } from "../types";

export type CollaborativeServerContext = {
    document: GoogleSpreadsheet
    profile: GoogleProfile
}

export async function getDocument (token: string, docId: string) {
    const doc = new GoogleSpreadsheet(docId)
    doc.useRawAccessToken(token)
    await doc.loadInfo()
    // const sheet = doc.sheetsByIndex[0];
    return doc
  }

export const getGoogleProfile = 
    async (token: string): Promise<GoogleProfile> => 
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (d) => d.json())

export const getCollaborativePost = async (doc: GoogleSpreadsheet) => {

}