// import type { Guild } from "discord.js"
import { action, observable } from "mobx"
import { signIn, signOut } from "next-auth/client"
import { getCustomSession } from "../AuthAdapter"
import type {
  GoogleDriveItem,
  GooglePickerCallback,
} from "../header/account/GooglePicker"
import { ShareDBClient } from "../sharedb/client"
import type { PostMeta, CustomSession, /* DiscordProfile,*/ GoogleProfile } from "../types"

export class CollaborationManager {
  shareClient = new ShareDBClient(this)

  @observable ready = false
  @observable googleUser: 
    | GoogleProfile
    | null = null
  // @observable discordUser: DiscordProfile | null = null
  @observable sheet:
    | (Partial<GoogleDriveItem> & Pick<GoogleDriveItem, "id">)
    | null = null
  // @observable guild?: Guild | null = null
  @observable session?: CustomSession | null

  @observable post: PostMeta | null = null

  @action link = async (type: "Discord" | "Google") => signIn(type.toLowerCase())

  @action unlink = async (type: "Discord" | "Google") => {
    const res = await fetch(`/api/auth/provider/${type.toLowerCase()}/unlink`, {
      method: "POST",
    })
    if (res.status === 204) {
      await signOut()
    }
    return this.load()
  }

  @action handleSheetSelection = (event: GooglePickerCallback) => {
    console.log(event)
    if (event.action === "picked") {
      this.sheet = event.docs[0]
      localStorage.setItem("pickedSheet", JSON.stringify(this.sheet))
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

  @action load = async () => {
    const session = await getCustomSession()
    console.log(session)
    this.ready = true
    this.session = session
    this.googleUser = session?.google ?? null
    this.sheet = JSON.parse(localStorage.getItem("pickedSheet") ?? "null")
  }
}
