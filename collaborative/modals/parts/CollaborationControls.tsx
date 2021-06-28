import { useObserver } from "mobx-react-lite"
import React, { useMemo } from "react"
import { useMutation } from "react-query"
import styled from "styled-components"
import { InputContainer } from "../../../common/input/layout/InputContainer"
import { InputLabel } from "../../../common/input/layout/InputLabel"
import { InputField } from "../../../common/input/text/InputField"
import { ButtonRow } from "../../../common/layout/ButtonRow"
import { FlexContainer } from "../../../common/layout/FlexContainer"
import { IconButton } from "../../../common/layout/IconButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { remove } from "../../../icons/remove"
import { base62toUUID } from "../../helpers/base62"
import { loading } from "../../icons/loading"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { PrimaryIconButton } from "./Layout"

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

export const CollaborationControls = () => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)
  const { isLoading: isUnlinkLoading, mutate: unlink } = useMutation(collaborationManager.unlink)
  const { isLoading: isRoomLoading, mutate: toggleRoom } = useMutation(collaborationManager.toggleRoom)
  const shortRoomId = useMemo(() => collaborationManager.roomId && base62toUUID.encode(collaborationManager.roomId), [collaborationManager.roomId])

  return useObserver(() => {
    const accounts = collaborationManager.session?.accounts ?? []
    return (
      <>
        <InputField
          id="roomUrl"
          placeholder={`${window.location.origin + window.location.pathname}?room=`}
          value={collaborationManager.roomId ? `${window.location.origin + window.location.pathname}?room=${shortRoomId}` : ""}
          label="Room URL"
          onChange={() => { }}
          readOnly
          disabled={isUnlinkLoading}
        >
          <PrimaryIconButton
            accent={collaborationManager.roomId ? "danger" : "primary"}
            onClick={() => !isRoomLoading && toggleRoom()}
            disabled={isUnlinkLoading}
          >
            <span>{collaborationManager.roomId ? "Leave Room" : "Create Room"}</span>
            {isRoomLoading && loading}
          </PrimaryIconButton>
        </InputField>
        <InputContainer>
          <InputLabel>Linked Accounts</InputLabel>
          <ButtonRow>
            {accounts.map(a => (
              <Card key={a.id}>
                <Avatar src={a.avatar} />
                <Name>{a.name}</Name>
                <IconButton
                  onClick={() => !isUnlinkLoading && unlink(a.type)}
                  icon={isUnlinkLoading ? loading : remove}
                  label="Unlink"
                />
              </Card>
            ))}
          </ButtonRow>
        </InputContainer>
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
