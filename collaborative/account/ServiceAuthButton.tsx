import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { PrimaryButton } from "../../common/input/button/PrimaryButton"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"

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

export const GoogleAuthButton = () => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  const Fallback = (
    <>
      To use collaboration features you must login into a Google account and select spreadsheet for milestone saves.
      <PrimaryButton onClick={async () => collaborationManager.link()}>Login via Google</PrimaryButton>
    </>
  )

  return useObserver(() => {
    if (!collaborationManager.session?.google) return Fallback
    const { name, picture } = collaborationManager.session.google
    return (
      <SocialProfile>
        <span>Logged as: {name}</span>
        <Avatar alt="Your Google Avatar" src={picture} />
      </SocialProfile>
    )
  })
}
