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

export type SocialTypeProps = { type: /* "Discord" |  */"Google" }
