import { action, observable } from "mobx"
import { signIn, signOut } from "next-auth/client"
import { getCustomSession } from "../helpers/AuthAdapter"
import { ShareDBClient } from "../sharedb/client"
import type { ChannelInstance } from "../sheet/channel"
import type { PostInstance } from "../sheet/post"
import type { CustomSession, SpreadsheetItem } from "../types"

export class CollaborationManager {
  shareClient = new ShareDBClient(this)
  @observable session?: CustomSession | null
  
  @observable spreadsheet?: SpreadsheetItem
  @observable post?: PostInstance
  @observable channel?: ChannelInstance

  getChannels = () => {
    console.log("getChannels")
  }

  getPosts = () => {
    console.log("getPosts")
  }

  @action link = async () => signIn("google")

  @action unlink = async () => {
    const res = await fetch("/api/auth/provider/google/unlink", { method: "POST" })
    if (res.status === 204) {
      await signOut()
    }
    return this.load()
  }

  // @action handleSheetSelection = (event: GooglePickerCallback) => {
  //   console.log(event)
  //   if (event.action === "picked") {
  //     this.sheet = event.docs[0]
  //     localStorage.setItem("pickedSheet", JSON.stringify(this.sheet))
  //   }
  // }

  // @action handleCreateNew = () => {
  //   console.log("CREATE NEW")
  // }

  // @action handlePost = async () => {
  //   if (!this.sheet) return
  //   console.log("HANDLE POST")
  //   await fetch("/api/post/", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       spreadsheetId: this.sheet.id,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  // }

  @action load = async () => {
    const session = await getCustomSession()
    console.log(session)
    this.session = session
    if (session?.google) {
      this.spreadsheet = JSON.parse(localStorage.getItem("pickedSheet") ?? "null")
    } else {
      localStorage.removeItem("pickedSheet")
    }
  }
}
