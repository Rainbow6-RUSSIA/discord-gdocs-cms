import type { CollaborativeSession } from "../convergence/CollaborativeSession"

export enum CollaborationManagerMode {
  OFFLINE,
  CONNECTING = 1 << 1,
  SAVING = 1 << 2,
  ONLINE = 1 << 3,
  SOLO = 1 << 4,
  TEAM = 1 << 5,
  ERROR = 1 << 6
}

export type CustomSession = {
  id: string
  accessToken: string
  expires: string
  // discord: null | DiscordProfile
  google: null | GoogleProfile
}

// export type DiscordProfile = {
//   avatar: string
//   discriminator: string
//   flags: number
//   id: string
//   locale: string
//   mfa_enabled: boolean
//   public_flags: number
//   username: string
//   guilds: (DiscordPartialGuild & { isBotPresent: boolean })[]
// }

// export type DiscordPartialGuild = {
//   id: string
//   name: string
//   icon: string
//   owner: boolean
//   permissions_new: string
//   features: string[]
// }

export type GoogleProfile = {
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  locale: string
  name: string
  picture: string
  sub: string
  accessToken: string
}

export type SpreadsheetItem = {
  id: string
  name: string
  starred: boolean
}

export type SocialTypeProps = { type: /* "Discord" |  */"Google" }

export type PostMeta = {
  id: number;
  name: string;
  part: number;
  collectionId: number;
}

export type ChannelMeta = {
  id: string;
  name: string;
}

export type ConnectionParams = {
  token: string, 
  spreadsheetId: string,
  channelId: string,
  postId: string
}

export type CollaborativeServerContext = {
  member: GoogleProfile,
  session: CollaborativeSession
}