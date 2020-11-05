import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { LoadingIcon } from "../../../common/icons/Loading"
import { ModalManagerContext } from "../../../common/modal/ModalManagerContext"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import type { SocialTypeProps } from "../../../types"
import { ExternalServiceManagerContext } from "../ExternalServiceManagerContext"
import { BaseAccountModal } from "./BaseAccountModal"

export const SocialProfile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;

  & > *:not(:last-child) {
    margin-right: 5px;
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

export const Avatar = styled.img.attrs({ height: 32, width: 32 })`
  border-radius: 50%;
`

export const ServiceAuthButton = ({ type }: SocialTypeProps) => {
  const serviceManager = useRequiredContext(ExternalServiceManagerContext)
  const modalManager = useRequiredContext(ModalManagerContext)

  const Fallback = (
    <button onClick={() => serviceManager.link(type)}>Login via {type}</button>
  )

  const Loading = (
    <SocialProfile>
      <LoadingIcon />
    </SocialProfile>
  )

  const handleClick = () =>
    modalManager.spawn({
      render: () => (
        <BaseAccountModal type={type} externalServiceManager={serviceManager} />
      ),
    })

  return useObserver(() => {
    if (!serviceManager.ready) return Loading

    if (type === "Discord") {
      if (!serviceManager.discordUser) return Fallback
      const { id, avatar, username, discriminator } = serviceManager.discordUser
      return (
        <SocialProfile onClick={handleClick}>
          <Avatar
            src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.${
              avatar.startsWith("a_") ? "gif" : "png"
            }?size=128`}
            alt="Your Discord Avatar"
          />
          <span>{`${username}#${discriminator}`}</span>
        </SocialProfile>
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (type === "Google") {
      if (!serviceManager.googleUser) return Fallback
      const { name, picture } = serviceManager.googleUser
      return (
        <SocialProfile onClick={handleClick}>
          <Avatar alt="Your Google Avatar" src={picture} />
          <span>{name}</span>
        </SocialProfile>
      )
    }

    return null
  })
}
