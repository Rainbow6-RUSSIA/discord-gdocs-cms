import { useObserver } from "mobx-react-lite"
import React from "react"
import { ModalAction } from "../../common/modal/layout/ModalAction"
import { ModalBody } from "../../common/modal/layout/ModalBody"
import { ModalContainer } from "../../common/modal/layout/ModalContainer"
import { ModalHeader } from "../../common/modal/layout/ModalHeader"
import { ModalTitle } from "../../common/modal/layout/ModalTitle"
import { ModalContext } from "../../common/modal/ModalContext"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { remove } from "../../icons/remove"
import { ServiceAuthButton } from "../header/account/ServiceAuthButton"

export function CollaborationModal() {
    const modal = useRequiredContext(ModalContext)

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
            <ServiceAuthButton type="Google" />
            <ServiceAuthButton type="Discord" />
        </ModalBody>
        </ModalContainer>
    ))
}
