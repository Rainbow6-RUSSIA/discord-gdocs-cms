import type { CollaborativeSession } from "../convergence/CollaborativeSession"

export enum CollaborationManagerMode {
  OFFLINE,
  CONNECTING = 1 << 1,
  SAVING = 1 << 2,
  ONLINE = 1 << 3,
  SOLO = 1 << 4,
  TEAM = 1 << 5,
  ERROR = 1 << 6,
}

export type SocialType = "discord" | "google"

export type CustomUser = GoogleUser | DiscordUser

export type GoogleUser = { type: "google" } & GoogleProfile & BasicUser
export type DiscordUser = { type: "discord" } & DiscordProfile & BasicUser

export type BasicUser = {
  id: string
  name: string
  locale?: string
  avatar: string
  email: string
}

export type DiscordProfile = {
  id: string
  username: string
  avatar: string | null
  discriminator: string
  public_flags?: number
  flags?: number
  locale?: string
  mfa_enabled?: boolean
  premium_type?: number
  email: string
  verified?: boolean
  guilds: DiscordPartialGuild[]
}

export type DiscordPartialGuild = {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions_new: string
  features: string[]

  hasBot: boolean
}

export type GoogleProfile = {
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  locale: string
  name: string
  picture: string
  sub: string
}

export type SpreadsheetItem = {
  id: string
  name: string
  starred: boolean
}

export type PostMeta = {
  id: number
  name: string
  part: number
  collectionId: number
}

export type ChannelMeta = {
  id: string
  name: string
}

export type ConnectionParams = {
  token: string
  spreadsheetId: string
  channelId: string
  postId: string
}

export type CollaborativeServerContext = {
  member: GoogleProfile
  session: CollaborativeSession
}
