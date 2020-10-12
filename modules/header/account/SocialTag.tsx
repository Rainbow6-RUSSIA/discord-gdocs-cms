import { getSession, signIn, signOut, useSession } from "next-auth/client"
import React from "react"
import styled from "styled-components"
import LoadingSvg from "../../../public/static/loading.svg"
import UnlinkSvg from "../../../public/static/unlink.svg"
import type { CustomSession } from "../../../types"

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
    color: #f04747;
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

const LoadingIcon = styled(LoadingSvg)`
  fill: ${({ theme }) => theme.header.primary};
`

type SocialProps = { type: "Discord" | "Google" }

export const ServiceAuthButton = ({ type }: SocialProps) => {
  const [session, loading] = (useSession() as unknown) as [
    CustomSession | null,
    boolean,
  ]

  const Fallback = (
    <button onClick={() => signIn(type.toLowerCase())}>Login via {type}</button>
  )

  const Loading = (
    <SocialProfile>
      <LoadingIcon />
    </SocialProfile>
  )

  if (loading) return Loading

  if (type === "Discord") {
    if (!session?.discord) return Fallback
    const { id, avatar, username, discriminator } = session.discord
    return (
      <SocialProfile>
        <UnlinkSvg
          onClick={() =>
            fetch("/api/auth/provider/discord/unlink", { method: "POST" }).then((res) => void (res.status === 204 && signOut()))
          }
        />
        <Avatar
          src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=32`}
        />
        <span>{`${username}#${discriminator}`}</span>
      </SocialProfile>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (type === "Google") {
    if (!session?.google) return Fallback
    const { name, picture } = session.google
    return (
      <SocialProfile>
        <UnlinkSvg
          onClick={() =>
            fetch("/api/auth/provider/google/unlink", { method: "POST" }).then((res) => void (res.status === 204 && signOut()))
          }
        />
        <Avatar src={picture} />
        <span>{name}</span>
      </SocialProfile>
    )
  }

  return null
}
