import React from "react"
import styled from "styled-components"
import UnlinkIcon from "../../../public/static/unlink.svg"
import type { GoogleProfile, DiscordProfile } from "../../../types"

const SocialProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;

  & > * {
    margin: 0 5px;
    transition: 0.5s;
  }

  & > svg {
    order: 1;
    cursor: pointer;
  }

  svg:hover ~ span {
    color: #F04747;
    transition: 0.5s;
  }

  svg:hover ~ img {
    filter: grayscale(100%);
    transition: 0.5s;
  }
`

const Avatar = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
`

type AuthHandlers = {
  handleSignIn: () => unknown
  handleUnlink: () => unknown
}

type GoogleProps = {
  type: "google"
  profile?: GoogleProfile | null
} & AuthHandlers

type DiscordProps = {
  type: "discord"
  profile?: DiscordProfile | null
} & AuthHandlers

export const ServiceAuthButton = (props: GoogleProps | DiscordProps) => {
  if (!props.profile)
    return (
      <button onClick={props.handleSignIn}>
        Login via {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
      </button>
    )

  if (props.type === "discord") {
    const { id, avatar, username, discriminator } = props.profile
    return (
      <SocialProfile>
        <UnlinkIcon onClick={props.handleUnlink}/>
        <Avatar
          src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=32`}
        />
        <span>{`${username}#${discriminator}`}</span>
      </SocialProfile>
    )
  }

  const { name, picture } = props.profile
  return (
    <SocialProfile>
      <UnlinkIcon onClick={props.handleUnlink}/>
      <Avatar src={picture} />
      <span>{name}</span>
    </SocialProfile>
  )
}