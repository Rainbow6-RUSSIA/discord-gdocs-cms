import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import LoadingSvg from "../../../public/static/loading.svg"
import UnlinkSvg from "../../../public/static/unlink.svg"
import { ExternalServiceManagerContext } from "../ExternalServiceManagerContext"

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
  const headerManager = useRequiredContext(ExternalServiceManagerContext)

  const Fallback = (
    <button onClick={() => headerManager.link(type)}>Login via {type}</button>
  )

  const Loading = (
    <SocialProfile>
      <LoadingIcon />
    </SocialProfile>
  )

  return useObserver(() => {
    if (!headerManager.ready) return Loading

    if (type === "Discord") {
      if (!headerManager.discordUser) return Fallback
      const { id, avatar, username, discriminator } = headerManager.discordUser
      return (
        <SocialProfile>
          <UnlinkSvg onClick={() => headerManager.unlink(type)} />
          <Avatar
            src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=32`}
          />
          <span>{`${username}#${discriminator}`}</span>
        </SocialProfile>
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === "Google") {
      if (!headerManager.googleUser) return Fallback
      const { name, picture } = headerManager.googleUser
      return (
        <SocialProfile>
          <UnlinkSvg onClick={() => headerManager.unlink(type)} />
          <Avatar src={picture} />
          <span>{name}</span>
        </SocialProfile>
      )
    }

    return null
  })
}
