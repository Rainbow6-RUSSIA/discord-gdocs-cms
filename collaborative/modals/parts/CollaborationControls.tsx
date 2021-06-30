import { observer } from "mobx-react-lite"
import React, { useMemo, useRef } from "react"
import { useMutation } from "react-query"
import styled from "styled-components"
import { copyTextToClipboard } from "../../../common/dom/copyTextToClipboard"
import { InputContainer } from "../../../common/input/layout/InputContainer"
import { InputLabel } from "../../../common/input/layout/InputLabel"
import { InputField } from "../../../common/input/text/InputField"
import { FlexContainer } from "../../../common/layout/FlexContainer"
import { IconButton } from "../../../common/layout/IconButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { TooltipManagerContext } from "../../../common/tooltip/TooltipManagerContext"
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

const CardContainer = styled(FlexContainer)`
  flex-wrap: wrap;
  gap: 12px;
`

const Card = styled(FlexContainer)`
  padding: 9px;
  border: 2px solid ${({ theme }) => theme.background.secondaryAlt};
  border-radius: 3px;
  background: ${({ theme }) => `${theme.background.secondaryAlt}`};
`

export const CollaborationControls = observer(() => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)
  const tooltipManager = useRequiredContext(TooltipManagerContext)

  // return useObserver(() => {
  const shortRoomId = useMemo(() => collaborationManager.roomId && base62toUUID.encode(collaborationManager.roomId), [collaborationManager.roomId])
  const domain = window.location.origin + window.location.pathname

  const anchorRef = useRef<HTMLInputElement>(null)

  const accounts = collaborationManager.session?.accounts ?? []
  const roomURL = collaborationManager.roomId ? `${domain}?room=${shortRoomId}` : ""

  const copy = () => {
    const { current: anchor } = anchorRef
    if (!anchor || !roomURL) return
    const dismiss = tooltipManager.add({
      anchor,
      content: "Copied",
    })

    copyTextToClipboard(roomURL)

    setTimeout(() =>
      anchor.dispatchEvent(
        new MouseEvent("mouseenter", {
          bubbles: true,
        })
      ), 0
    ) // вкл показ без перезахода в поле

    setTimeout(dismiss, 3000)
  }

  const { isLoading: isUnlinkLoading, mutate: unlink } = useMutation(collaborationManager.unlink)
  const { isLoading: isRoomLoading, mutate: toggleRoom } = useMutation(
    async () =>
      collaborationManager
        .toggleRoom()
        .then(() => collaborationManager.roomId && copy())
  )

  return (
    <>
      <InputField
        id="roomUrl"
        placeholder={`${domain}?room=`}
        value={roomURL}
        label="Room URL"
        onChange={() => { }}
        onClick={copy}
        readOnly
        disabled={isUnlinkLoading}
        ref={anchorRef}
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
        <CardContainer>
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
        </CardContainer>
      </InputContainer>
    </>
  )
  // }

})
