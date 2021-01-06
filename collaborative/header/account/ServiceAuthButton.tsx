import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { ModalManagerContext } from "../../../common/modal/ModalManagerContext"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { loading } from "../../icons/loading"
import type { SocialTypeProps } from "../../types"
import { ExternalServiceManagerContext } from "../ExternalServiceManagerContext"
import { BaseAccountModal } from "./BaseAccountModal"

export const SocialProfile = styled.div`
  min-width: 100px;
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
    <>
      To use collaboration features you must login into a Google account and select spreadsheet for milestone saves.
      <PrimaryButton onClick={async () => serviceManager.link(type)}>Login via {type}</PrimaryButton>
    </>
  )

  const Loading = (
    <SocialProfile>
      {loading}
    </SocialProfile>
  )

  // const handleClick = () =>
  //   modalManager.spawn({
  //     render: () => (
  //       <BaseAccountModal type={type} externalServiceManager={serviceManager} />
  //     ),
  //   })

  return useObserver(() => {
    if (!serviceManager.ready) return Loading

    if (type === "Discord") {
      if (!serviceManager.discordUser) return Fallback
      const { id, avatar, username, discriminator } = serviceManager.discordUser
      return (
        <SocialProfile>
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
        <SocialProfile>
          <span>Logged as: {name}</span>
          <Avatar alt="Your Google Avatar" src={picture} />
        </SocialProfile>
      )
    }

    return null
  })
}
