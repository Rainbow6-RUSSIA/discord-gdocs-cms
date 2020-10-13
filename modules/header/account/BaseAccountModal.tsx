import { useObserver } from "mobx-react-lite"
import React, { useState } from "react"
import { LoadingIcon } from "../../../common/icons/Loading"
import { Button } from "../../../common/input/Button"
import { ModalContext } from "../../../common/modal/ModalContext"
import { BaseModal } from "../../../common/modal/styles/BaseModal"
import { BaseModalBody } from "../../../common/modal/styles/BaseModalBody"
import { BaseModalFooter } from "../../../common/modal/styles/BaseModalFooter"
import { BaseModalHeader } from "../../../common/modal/styles/BaseModalHeader"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import type { SocialTypeProps } from "../../../types"
import type { ExternalServiceManager } from "../ExternalServiceManager"
import { DiscordBody } from "./services/DiscordBody"
import { GoogleBody } from "./services/GoogleBody"

export type AccountModalProp = {
  externalServiceManager: ExternalServiceManager
  loading: boolean
}

export function BaseAccountModal({
  type,
  externalServiceManager: serviceManager,
  loading = false,
}: SocialTypeProps & AccountModalProp) {
  const modal = useRequiredContext(ModalContext)

  const [isLoading, setLoading] = useState(loading)
  const handleUnlink = async () => {
    setLoading(true)
    await serviceManager.unlink(type)
    modal.dismiss()
  }

  return useObserver(() => (
    <BaseModal>
      <BaseModalHeader>{type} Settings</BaseModalHeader>
      <BaseModalBody>
        {!serviceManager.session?.[type.toLowerCase() as "discord" | "google"]
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
        ) : null}
      </BaseModalBody>
      <BaseModalFooter>
        <Button size="medium" accent="danger" onClick={handleUnlink}>
          Unlink {type}{" "}
          {isLoading ? <LoadingIcon style={{ verticalAlign: "sub" }} /> : null}
        </Button>
        <Button size="medium" onClick={() => modal.dismiss()}>
          Close
        </Button>
      </BaseModalFooter>
    </BaseModal>
  ))
}
