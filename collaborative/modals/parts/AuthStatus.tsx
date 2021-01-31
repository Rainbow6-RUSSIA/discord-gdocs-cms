import { useObserver } from "mobx-react-lite"
import { darken } from "polished"
import React from "react"
import styled from "styled-components"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { ButtonRow } from "../../../common/layout/ButtonRow"
import { FlexContainer } from "../../../common/layout/FlexContainer"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"

const Name = styled.div`
  line-height: 32px;
  margin-right: 5px;
`

const Avatar = styled.img.attrs({ height: 32, width: 32 })`
  border-radius: 50%;
`

const Card = styled(FlexContainer)`
  padding: 9px;
  border: 2px solid ${({ theme }) => theme.background.secondaryAlt};
  border-radius: 3px;
  background: ${({ theme }) => `${theme.background.secondaryAlt}`};
`

const GoogleLoginButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0 auto;
  background-color: #4285F4;
  border-color: #4285F4;
  & > * {
    margin-right: 3px;
  }
  &:hover {
    background-color: #4285F4;
    border-color: ${darken(0.1, "#4285F4")};
  }
`

export const AuthStatus = () => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  const Fallback = (
    <>
      To use collaboration features you must login into a Google account and select spreadsheet for milestone saves.
      <GoogleLoginButton onClick={async () => collaborationManager.link()}>
        <img height="32" src="/static/google-button.svg" />
        <span>Sign in with Google</span>
      </GoogleLoginButton>
    </>
  )

  return useObserver(() => {
    if (!collaborationManager.session?.google) return Fallback
    const { name, picture } = collaborationManager.session.google
    return (
      <>
        Logged as:
        <ButtonRow>
          <Card>
            <Name>{name}</Name>
            <Avatar alt="Your Google Avatar" src={picture} />
          </Card>
        </ButtonRow>
      </>
    )
  })
}
