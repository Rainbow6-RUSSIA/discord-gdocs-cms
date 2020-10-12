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

export type ExternalServiceManagerProp = {
  externalServiceManager: ExternalServiceManager
}

export function BaseAccountModal({
  type,
  externalServiceManager,
}: SocialTypeProps & ExternalServiceManagerProp) {
  const modal = useRequiredContext(ModalContext)

  const [loading, setLoading] = useState(false)
  const handleUnlink = async () => {
    setLoading(true)
    await externalServiceManager.unlink(type)
    modal.dismiss()
  }

  return useObserver(() => (
    <BaseModal>
      <BaseModalHeader>{type} Settings</BaseModalHeader>
      <BaseModalBody>Body</BaseModalBody>
      <BaseModalFooter>
        <Button size="medium" accent="danger" onClick={handleUnlink}>
          Unlink {type}{" "}
          {loading ? <LoadingIcon style={{ verticalAlign: "sub" }} /> : null}
        </Button>
        <Button size="medium" onClick={() => modal.dismiss()}>
          Close
        </Button>
      </BaseModalFooter>
    </BaseModal>
  ))
}
