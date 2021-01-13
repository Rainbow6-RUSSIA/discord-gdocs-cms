import { useObserver } from "mobx-react-lite"
import React, { useState } from "react"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { SecondaryButton } from "../../../common/input/button/SecondaryButton"
import { ModalBody } from "../../../common/modal/layout/ModalBody"
import { ModalContainer } from "../../../common/modal/layout/ModalContainer"
import { ModalFooter } from "../../../common/modal/layout/ModalFooter"
import { ModalHeader } from "../../../common/modal/layout/ModalHeader"
import { ModalContext } from "../../../common/modal/ModalContext"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { loading } from "../../icons/loading"
import type { CollaborationManager } from "../../manager/CollaborationManager"
import type { SocialTypeProps } from "../../types"
import { DiscordBody } from "./services/DiscordBody"
import { GoogleBody } from "./services/GoogleBody"

export type AccountModalProp = {
  externalServiceManager: CollaborationManager
  ready: boolean
}

export function BaseAccountModal({
  type,
  externalServiceManager: serviceManager,
}: SocialTypeProps & Omit<AccountModalProp, "loading">) {
  const modal = useRequiredContext(ModalContext)

  const [isLoading, setLoading] = useState(false)
  const handleUnlink = async () => {
    setLoading(true)
    await serviceManager.unlink(type)
    modal.dismiss()
  }

  return useObserver(() => (
    <ModalContainer>
      <ModalHeader>{type} Settings</ModalHeader>
      <ModalBody>
        {/* {!serviceManager.session?.[type.toLowerCase() as "discord" | "google"]
          ? `Sign in via ${type} is required`
          : null}
        {type === "Google" && serviceManager.googleUser ? (
          <GoogleBody
            loading={isLoading}
            externalServiceManager={serviceManager}
          />
        ) : null}
        {type === "Discord" && serviceManager.discordUser ? (
          <DiscordBody
            loading={isLoading}
            externalServiceManager={serviceManager}
          />
        ) : null} */}
      </ModalBody>
      <ModalFooter>
        <PrimaryButton accent="danger" onClick={handleUnlink}>
          Unlink {type}{" "}
          {isLoading ? loading : null}
        </PrimaryButton>
        <SecondaryButton onClick={() => modal.dismiss()}>
          Close
        </SecondaryButton>
      </ModalFooter>
    </ModalContainer>
  ))
}
