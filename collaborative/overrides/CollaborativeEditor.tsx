import { useObserver } from "mobx-react-lite"
import React, { useEffect } from "react"
import styled from "styled-components"
import { useWindowEvent } from "../../common/dom/useWindowEvent"
import { SecondaryButton } from "../../common/input/button/SecondaryButton"
import { Separator } from "../../common/layout/Separator"
import { Stack } from "../../common/layout/Stack"
import { ModalManagerContext } from "../../common/modal/ModalManagerContext"
import { Footer } from "../../common/page/Footer"
import { usePreference } from "../../common/settings/usePreference"
import { useLazyValue } from "../../common/state/useLazyValue"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { EditorManagerContext } from "../../modules/editor/EditorManagerContext"
import { ClearAllConfirmationModal } from "../../modules/editor/message/ClearAllConfirmationModal"
import { createEditorForm } from "../../modules/message/state/editorForm"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import { CollaborativeMessageEditor } from "./CollaborativeMessageEditor"
import { CollaborativeWebhookControls } from "./CollaborativeWebhookControls"

const EditorContainer = styled(Stack)`
  padding: 16px 16px 0;
`

const Actions = styled.div`
  display: flex;
  flex-flow: wrap;

  margin-bottom: -8px;

  & > * {
    margin-right: 12px;
    margin-bottom: 8px;
  }
`

export function CollaborativeEditor() {
  const editorManager = useRequiredContext(EditorManagerContext)
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  const form = useLazyValue(() => createEditorForm(editorManager))
  useEffect(() => () => form.dispose(), [form])

  const modalManager = useRequiredContext(ModalManagerContext)

  const spawnClearAllModal = () =>
    modalManager.spawn({
      render: () => <ClearAllConfirmationModal editorManager={editorManager} />,
    })

  const confirmExit = usePreference("confirmExit")
  useWindowEvent("beforeunload", event => {
    if (!confirmExit) return

    event.preventDefault()
    event.returnValue = ""
    return ""
  })

  return useObserver(() => (
    <EditorContainer gap={16}>
      <Actions>
        <SecondaryButton onClick={collaborationManager.handleSave}>
          Save
        </SecondaryButton>
        <SecondaryButton onClick={() => spawnClearAllModal()}>
          Clear All
        </SecondaryButton>
      </Actions>
      <CollaborativeWebhookControls form={form} />
      <Separator />
      {editorManager.messages.map((message, index) => (
        <CollaborativeMessageEditor
          key={message.id}
          message={message}
          form={form.repeatingForm("messages").index(index)}
        />
      ))}
    </EditorContainer>
  ))
}
