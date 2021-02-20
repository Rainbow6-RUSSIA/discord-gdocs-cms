import { useObserver } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useMutation, useQuery } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { PrimaryButton } from "../../common/input/button/PrimaryButton"
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
import { loading } from "../icons/loading"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import { AuthStatus } from "./parts/AuthStatus"
import { SpreadsheetSelector } from "./parts/SpreadsheetSelector"

export function CollaborationModal() {
  const modal = useRequiredContext(ModalContext)
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  const user = collaborationManager.session?.google

  const { isLoading: isUnlinking, mutate: handleUnlink } = useMutation(
    collaborationManager.unlink,
  )

  // useEffect(() => {
  //     // TODO: form init
  //     collaborationManager.spreadsheet = undefined
  //     collaborationManager.channel = undefined
  //     collaborationManager.post = undefined
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return useObserver(() => (
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
          <AuthStatus />
          {user && <SpreadsheetSelector />}
        </Stack>
        <div style={{ display: "inline" }}>
          <ReactQueryDevtools />
        </div>
      </ModalBody>
      <ModalFooter>
        {user && (
          <PrimaryButton onClick={() => handleUnlink()} accent="danger">
            {"Logout "}
            {isUnlinking ? loading : null}
          </PrimaryButton>
        )}
        <PrimaryButton onClick={() => modal.dismiss()}>Close</PrimaryButton>
      </ModalFooter>
    </ModalContainer>
  ))
}
