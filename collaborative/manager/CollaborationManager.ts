import { action, observable } from "mobx"
import type { Session } from "next-auth"
import { signIn, signOut } from "next-auth/client"
import { getSession } from "next-auth/client"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
// import type { SaveAPIQuery } from "../../pages/api/collaboration/save"
import { ConvergenceClient } from "../convergence/client"
// import { convertContentToSheet } from "../helpers/convert"
// import type { ChannelInstance } from "../sheet/channel"
// import type { MessageInstance } from "../sheet/post"
import {
  CollaborationManagerMode,
  // CustomSession,
  DiscordUser,
  // GoogleProfile,
  GoogleUser,
  SocialType,
  // SpreadsheetItem,
} from "../types"

export class CollaborationManager {
  static LSSettingsKey = "collaborationSettings"
  // shareClient = new ConvergenceCursor(this)
  @observable session: Session | null = null

  @observable spreadsheet?: Record<string, unknown>
  @observable channel?: Record<string, unknown>
  @observable collection?: []

  @observable mode = CollaborationManagerMode.OFFLINE
  error?: Error

  @action showError(err: Error) {
    this.error = err
    this.setMode(CollaborationManagerMode.ERROR)
    // eslint-disable-next-line no-alert
    alert(err.message)
    setTimeout(() => {
      this.resetMode(CollaborationManagerMode.ERROR)
      delete this.error
    }, 10000)
  }
  setMode(f: CollaborationManagerMode) {
    this.mode |= f
  } // don't add @action or you'll get infinite loop
  resetMode(f: CollaborationManagerMode) {
    this.mode &= ~f
  } // don't add @action or you'll get infinite loop
  hasMode(f: CollaborationManagerMode) {
    return Boolean(this.mode & f)
  }

  link = async (type: SocialType) => signIn(type)

  @action unlink = async (type: SocialType) => {
    const res = await fetch(`/api/auth/provider/${type}/unlink`, {
      method: "POST",
    })
    if (!res.ok) return this.showError(new Error(res.statusText))
    if (res.status === 204) {
      await signOut()
    }
    return this.load()
  }

  get google() {
    return this.session?.accounts.find(
      (a): a is GoogleUser => a.type === "google",
    )
  }

  get discord() {
    return this.session?.accounts.find(
      (a): a is DiscordUser => a.type === "discord",
    )
  }

  saveSettings = () => {
    //   localStorage.setItem(
    //     CollaborationManager.LSSettingsKey,
    //     JSON.stringify({
    //       spreadsheet: this.spreadsheet,
    //       channel: this.channel,
    //       // TODO:
    //       // post: this.post,
    //     }),
    //   )
  }

  @action loadSettings = () => {
    //   const settings = JSON.parse(
    //     localStorage.getItem(CollaborationManager.LSSettingsKey) ?? "{}",
    //   )
    //   this.spreadsheet = settings.spreadsheet
    //   this.channel = settings.channel
    //   // TODO:
    //   // this.post = settings.post
  }

  @action resetSettings = () => {
    localStorage.removeItem(CollaborationManager.LSSettingsKey)
  }

  @action load = async (editor?: EditorManagerLike) => {
    this.editor = this.editor ?? editor
    const session = await getSession()
    console.log(session)
    this.session = session
    if (session && session.accounts.length > 0) {
      //   this.loadSettings()
      try {
        this.convergence = new ConvergenceClient(this)
      } catch (error) {
        this.showError(error)
      }
    } // else this.resetSettings()
  }

  handleSave = async () => {
    // TODO:
    // const spreadsheet = this.spreadsheet
    // const channel = this.channel
    // const post = this.post
    // if (spreadsheet && channel && post && this.convergence?.model) {
    //   const query: Record<SaveAPIQuery, string> = {
    //     spreadsheetId: spreadsheet.id,
    //     channelId: channel.id,
    //     postId: post.id,
    //   }
    //   const res = await fetch(
    //     `/api/collaboration/save?${new URLSearchParams(query)}`,
    //     {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(
    //         Object.assign(
    //           this.post,
    //           convertContentToSheet(
    //             this.convergence.model.root().value() as EditorManagerLike,
    //           )[1],
    //         ),
    //       ),
    //     },
    //   )
    //   if (res.status !== 200) throw new Error("Failed to save")
    // } else {
    //   throw new Error(
    //     `Cannon save ${spreadsheet?.id}, ${channel?.id}, ${post?.id}`,
    //   )
    // }
  }

  editor?: EditorManagerLike
  convergence?: ConvergenceClient
}
