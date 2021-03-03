import { useObserver } from "mobx-react-lite"
import React from "react"
import { useMutation } from "react-query"
import styled from "styled-components"
import { ButtonRow } from "../../../common/layout/ButtonRow"
import { FlexContainer } from "../../../common/layout/FlexContainer"
import { IconButton } from "../../../common/layout/IconButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { remove } from "../../../icons/remove"
import { loading } from "../../icons/loading"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"

const Name = styled.div`
  line-height: 32px;
  margin-left: 8px;
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
  const { isLoading, mutate: unlink } = useMutation(collaborationManager.unlink)

  return useObserver(() => {
    const accounts = collaborationManager.session?.accounts ?? []
    return (
      <>
        Linked Accounts:
        <ButtonRow>
          {accounts.map(a => (
            <Card key={a.id}>
              <Avatar src={a.avatar} />
              <Name>{a.name}</Name>
              <IconButton
                onClick={() => !isLoading && unlink(a.type)}
                icon={isLoading ? loading : remove}
                label="Unlink"
              />
            </Card>
          ))}
        </ButtonRow>
      </>
    )
  })
}
/*
  const { isLoading: isUnlinking, mutate: handleUnlink } = useMutation(
    collaborationManager.unlink,
  )
        {user && (
          <PrimaryButton onClick={() => handleUnlink()} accent="danger">
            {"Logout "}
            {isUnlinking ? loading : null}
          </PrimaryButton>
        )}
        */
