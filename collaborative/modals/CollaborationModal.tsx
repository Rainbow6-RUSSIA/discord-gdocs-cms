import { useObserver } from "mobx-react-lite"
import { signOut } from "next-auth/client"
import React from "react"
import { useMutation } from "react-query"
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
import { loading } from "../icons/loading"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import { CollaborationControls } from "./parts/CollaborationControls"
import { DiscordSettings } from "./parts/DiscordSettings"
import { GoogleSettings } from "./parts/GoogleSettings"
import { PrimaryIconButton } from "./parts/Layout"


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

  // const [session, loading] = useSession()
  const { isLoading: isLogoutLoading, mutate: logout } = useMutation(async () => signOut())

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
            {accounts.length > 0 ? <CollaborationControls /> : "You must be logged into at least one account to use the collaboration features:"}
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

          {collaborationManager.session &&
            <PrimaryIconButton onClick={() => !isLogoutLoading && logout()} accent="danger">
              <span>Logout</span>
              {isLogoutLoading && loading}
            </PrimaryIconButton>

          }
          <PrimaryButton onClick={() => modal.dismiss()}>Close</PrimaryButton>
        </ModalFooter>
      </ModalContainer>
    )
  })
}
