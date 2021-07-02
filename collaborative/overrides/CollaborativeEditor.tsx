import { PropertyReference, RealTimeObject, RemoteReferenceCreatedEvent } from "@convergence/convergence"
import ColorHash from "color-hash"
import { observer } from "mobx-react-lite"
import dynamic from "next/dynamic"
import { transparentize } from "polished"
import React, { Fragment, useEffect, useState } from "react"
import styled from "styled-components"
import { useWindowEvent } from "../../common/dom/useWindowEvent"
import { PrimaryButton } from "../../common/input/button/PrimaryButton"
import { SecondaryButton } from "../../common/input/button/SecondaryButton"
import { ButtonList } from "../../common/layout/ButtonList"
import { Separator } from "../../common/layout/Separator"
import { Stack } from "../../common/layout/Stack"
import { ModalManagerContext } from "../../common/modal/ModalManagerContext"
import { usePreference } from "../../common/settings/usePreference"
import { useLazyValue } from "../../common/state/useLazyValue"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import type { BackupsModalProps } from "../../modules/database/backup/modal/BackupsModal"
import { EditorManagerContext } from "../../modules/editor/EditorManagerContext"
import { ClearAllConfirmationModal } from "../../modules/editor/message/ClearAllConfirmationModal"
import { ShareModal } from "../../modules/editor/share/ShareModal"
import { WebhookControls } from "../../modules/editor/webhook/WebhookControls"
import { Markdown } from "../../modules/markdown/Markdown"
import { createEditorForm } from "../../modules/message/state/editorForm"
import type { MessageLike } from "../../modules/message/state/models/MessageModel"
import type { CursorsMap } from "../convergence/cursor"
import { CursorsContextProvider } from "../convergence/CursorContext"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import { CollaborativeMessageEditor } from "./CollaborativeMessageEditor"

const BackupsModal = dynamic<BackupsModalProps>(async () =>
  import("../../modules/database/backup/modal/BackupsModal").then(
    module => module.BackupsModal,
  ),
)

const EditorContainer = styled(Stack)`
  padding: 16px 16px 0;
`

const JavaScriptWarning = styled.noscript`
  display: block;

  margin-bottom: 16px;
  padding: 16px;
  border-radius: 4px;

  border: 2px solid ${({ theme }) => theme.accent.danger};
  background: ${({ theme }) => transparentize(0.75, theme.accent.danger)};

  color: ${({ theme }) => theme.header.primary};
  font-weight: 500;
  line-height: 1.375;
`

export const CollaborativeEditor = observer(() => {
  const editorManager = useRequiredContext(EditorManagerContext)
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  const [cursors, setCursors] = useState<CursorsMap>(new Map())

  useEffect(() => {
    const model = collaborationManager.convergence?.model
    if (!model) return

    console.log("CURSORS useEffect")

    const localSession = model.session().sessionId()
    const root = model.root()

    const getCollaborator = (sessionId: string) => model.collaborators().find(c => c.sessionId === sessionId) ?? { user: null }
    const getPathRef = (sessionId: string) => root.reference(sessionId, "path") as PropertyReference
    const getSelectionRef = (sessionId: string) => root.reference(sessionId, "selection") as PropertyReference

    const updateCursor = (sessionId: string) => {
      const { user } = getCollaborator(sessionId)
      const pathRef = getPathRef(sessionId)
      const selectionRef = getSelectionRef(sessionId)
      if (user && pathRef && selectionRef) {
        setCursors(cursors =>
          new Map(
            cursors.set(sessionId, {
              color: new ColorHash().hex(user.username),
              path: pathRef.value(),
              selection: selectionRef.values().map(Number) as [number, number],
              isLocal: sessionId === localSession,
              timestamp: Date.now()
            })
          )
        )
      } else {
        setCursors(cursors => {
          cursors.delete(sessionId)
          return new Map(cursors)
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refEventHandler = (refEvent: any) => {
      console.log("REF EVENT", refEvent)
      updateCursor(refEvent.src.sessionId())
    }

    const setReferenceHandlers = (ref: PropertyReference) => {
      ref.on(PropertyReference.Events.SET, refEventHandler)
      ref.on(PropertyReference.Events.CLEARED, refEventHandler)
      ref.on(PropertyReference.Events.DISPOSED, refEventHandler)
    }

    const unsetReferenceHandlers = (ref: PropertyReference) => {
      ref.off(PropertyReference.Events.SET, refEventHandler)
      ref.off(PropertyReference.Events.CLEARED, refEventHandler)
      ref.off(PropertyReference.Events.DISPOSED, refEventHandler)
    }

    const newRefHandler = (newRefEvent: unknown) => {
      const { reference } = newRefEvent as RemoteReferenceCreatedEvent
      setReferenceHandlers(reference as PropertyReference)
    }

    root.on(RealTimeObject.Events.REFERENCE, newRefHandler)
    for (const ref of root.references({ key: "path" })) { setReferenceHandlers(ref); updateCursor(ref.sessionId()) }
    for (const ref of root.references({ key: "selection" })) { setReferenceHandlers(ref); updateCursor(ref.sessionId()) }

    return () => {
      root.off(RealTimeObject.Events.REFERENCE, newRefHandler)
      for (const ref of root.references({ key: "path" })) unsetReferenceHandlers(ref)
      for (const ref of root.references({ key: "selection" })) unsetReferenceHandlers(ref)
    }
  }, [
    collaborationManager.convergence?.model,
    collaborationManager.convergence?.user?.username
  ])

  const form = useLazyValue(() => createEditorForm(editorManager))
  useEffect(() => () => form.dispose(), [form])

  const modalManager = useRequiredContext(ModalManagerContext)

  const spawnBackupsModal = () =>
    modalManager.spawn({
      render: () => <BackupsModal editorManager={editorManager} />,
    })

  const spawnClearAllModal = () =>
    modalManager.spawn({
      render: () => <ClearAllConfirmationModal editorManager={editorManager} />,
    })

  const spawnShareModal = () =>
    modalManager.spawn({
      render: () => <ShareModal editorManager={editorManager} />,
    })

  const confirmExit = usePreference("confirmExit")
  useWindowEvent("beforeunload", event => {
    if (!confirmExit) return

    event.preventDefault()
    event.returnValue = ""
    return ""
  })

  console.log("CURSORS", cursors)

  return (
    <CursorsContextProvider value={cursors}>
      <EditorContainer gap={16}>
        <JavaScriptWarning>
          <Markdown
            content={
              "It appears your web browser has prevented this page from " +
              "executing JavaScript.\nTo use QuarrelPost, please allow this page " +
              "to run JavaScript from your browser's settings."
            }
          />
        </JavaScriptWarning>
        <ButtonList>
          <SecondaryButton onClick={() => spawnBackupsModal()}>
            Backups
          </SecondaryButton>
          <SecondaryButton onClick={() => spawnClearAllModal()}>
            Clear All
          </SecondaryButton>
          <SecondaryButton onClick={() => spawnShareModal()}>
            Share Message
          </SecondaryButton>
        </ButtonList>
        <WebhookControls form={form} />
        {editorManager.messages.map((message, index) => (
          <Fragment key={message.id}>
            <Separator />
            <CollaborativeMessageEditor
              message={message}
              form={form.repeatingForm("messages").index(index)}
            />
          </Fragment>
        ))}
        <Separator />
        <div>
          <PrimaryButton
            onClick={() => {
              form.repeatingForm("messages").push({} as MessageLike)
            }}
          >
            Add Message
          </PrimaryButton>
        </div>
      </EditorContainer>
    </CursorsContextProvider>
  )
})
