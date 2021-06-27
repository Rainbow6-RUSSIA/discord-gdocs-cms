import { useObserver } from "mobx-react-lite"
import React from "react"
import { ReactQueryDevtools } from "react-query/devtools"
import { PrimaryButton } from "../../common/input/button/PrimaryButton"
import { Separator } from "../../common/layout/Separator"
import { Stack } from "../../common/layout/Stack"
import { ModalAction } from "../../common/modal/layout/ModalAction"
import { ModalBody } from "../../common/modal/layout/ModalBody"
import { ModalContainer } from "../../common/modal/layout/ModalContainer"
import { ModalFooter } from "../../common/modal/layout/ModalFooter"
import { ModalHeader } from "../../common/modal/layout/ModalHeader"
import { ModalTitle } from "../../common/modal/layout/ModalTitle"
import { ModalContext } from "../../common/modal/ModalContext"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { remove } from "../../icons/remove"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import { AuthStatus } from "./parts/AuthStatus"
import { DiscordSettings } from "./parts/DiscordSettings"
import { GoogleSettings } from "./parts/GoogleSettings"

export function CollaborationModal() {
  const modal = useRequiredContext(ModalContext)
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  // useEffect(() => {
  //     // TODO: form init
  //     collaborationManager.spreadsheet = undefined
  //     collaborationManager.channel = undefined
  //     collaborationManager.post = undefined
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return useObserver(() => {
    const accounts = collaborationManager.session?.accounts ?? []

    return (
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Collaboration Settings</ModalTitle>
          <ModalAction
            icon={remove}
            label="Close"
            onClick={() => modal.dismiss()}
          />
        </ModalHeader>
        <ModalBody>
          <Stack gap={8}>
            {accounts.length > 0 ? <AuthStatus /> : "To use collaboration features you must login into atleast one account:"}
            <Separator />
            <DiscordSettings />
            <Separator />
            <GoogleSettings />
          </Stack>
          <div style={{ display: "inline" }}>
            <ReactQueryDevtools />
          </div>
        </ModalBody>
        <ModalFooter>
          <PrimaryButton onClick={() => modal.dismiss()}>Close</PrimaryButton>
        </ModalFooter>
      </ModalContainer>
    )
  })
}
