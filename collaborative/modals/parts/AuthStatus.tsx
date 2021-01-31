import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { ButtonRow } from "../../../common/layout/ButtonRow"
import { FlexContainer } from "../../../common/layout/FlexContainer"
import { RowContainer } from "../../../common/layout/RowContainer"
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

export const AuthStatus = () => {
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
      <>
        Logged as:
        <ButtonRow>
          <Card>
            <Name>{name}</Name>
            <Avatar alt="Your Google Avatar" src={picture} />
          </Card>
          {/* <PrimaryButton>Test</PrimaryButton> */}
        </ButtonRow>
      </>
    )
  })
}
