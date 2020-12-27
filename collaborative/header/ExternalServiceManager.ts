import type { Guild } from "discord.js"
import { action, observable } from "mobx"
import { signIn, signOut } from "next-auth/client"
import { getCustomSession } from "../AuthAdapter"
import type { CustomSession, DiscordProfile, GoogleProfile } from "../types"
import type {
  GoogleDriveItem,
  GooglePickerCallback,
} from "./account/GooglePicker"

export class ExternalServiceManager {
  @observable ready = false
  @observable googleUser: GoogleProfile | null = null
  @observable discordUser: DiscordProfile | null = null
  @observable sheet:
    | (Partial<GoogleDriveItem> & Pick<GoogleDriveItem, "id">)
    | null = null
  @observable guild?: Guild | null = null
  @observable session?: CustomSession | null

  @action link = (type: "Discord" | "Google") => signIn(type.toLowerCase())

  @action unlink = async (type: "Discord" | "Google") => {
    const res = await fetch(`/api/auth/provider/${type.toLowerCase()}/unlink`, {
      method: "POST",
    })
    if (res.status === 204) {
      await signOut()
    }
    return this.init()
  }

  @action handleSheetSelection = (event: GooglePickerCallback) => {
    console.log(event)
    if (event.action === "picked") {
      this.sheet = event.docs[0]
    }
  }

  @action handleCreateNew = () => {
    console.log("CREATE NEW")
  }

  @action handlePost = async () => {
    if (!this.sheet) return
    console.log("HANDLE POST")
    await fetch("/api/post/", {
      method: "POST",
      body: JSON.stringify({
        spreadsheetId: this.sheet.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  @action init = async () => {
    const session = await getCustomSession()
    console.log(session)
    this.ready = true
    this.session = session
    this.discordUser = session?.discord ?? null
    this.googleUser = session?.google ?? null
  }

  constructor() {
    void this.init()
  }
}
