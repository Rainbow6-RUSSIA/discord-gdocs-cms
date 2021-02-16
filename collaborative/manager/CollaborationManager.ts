import { action, observable } from "mobx"
import { signIn, signOut } from "next-auth/client"
import { getCustomSession } from "../auth/session"
import type { ChannelInstance } from "../sheet/channel"
import type { PostInstance } from "../sheet/post"
import type { CustomSession, SpreadsheetItem } from "../types"

export class CollaborationManager {
  static LSSettingsKey = "collaborationSettings"
  // shareClient = new ConvergenceCursor(this)
  @observable session?: CustomSession | null
  
  @observable spreadsheet?: SpreadsheetItem
  @observable channel?: ChannelInstance
  @observable post?: PostInstance

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

  saveSettings = () => {
    localStorage.setItem(CollaborationManager.LSSettingsKey, JSON.stringify({ 
      spreadsheet: this.spreadsheet,
      channel: this.channel,
      post: this.post
    }))
  }

  @action loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem(CollaborationManager.LSSettingsKey) ?? "{}")
    this.spreadsheet = settings.spreadsheet
    this.channel = settings.channel
    this.post = settings.post
  }

  @action resetSettings = () => {
    localStorage.removeItem(CollaborationManager.LSSettingsKey)
  }

  // @action handleSheetSelection = (event: GooglePickerCallback) => {
  //   console.log(event)
  //   if (event.action === "picked") {
  //     this.sheet = event.docs[0]
  //     
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
    if (session?.google) this.loadSettings()
    else this.resetSettings()
  }
}
