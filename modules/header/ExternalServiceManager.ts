import type { Guild } from "discord.js"
import { action, observable } from "mobx"
import { signIn, signOut } from "next-auth/client"
import type { CustomSession, DiscordProfile, GoogleProfile } from "../../types"
import { getCustomSession } from "../AuthAdapter"

export class ExternalServiceManager {
  @observable ready = false
  @observable googleUser: GoogleProfile | null = null
  @observable discordUser: DiscordProfile | null = null
  @observable sheetId = ""
  @observable guild?: Guild | null = null
  @observable session?: CustomSession

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

  @action pickSheet() {}

  @action init = async () => {
    const session = await getCustomSession()
    this.ready = true
    this.session = session
    this.discordUser = session?.discord ?? null
    this.googleUser = session?.google ?? null
  }

  constructor() {
    void this.init()
  }
}
