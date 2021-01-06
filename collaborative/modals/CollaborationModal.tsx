import { useObserver } from "mobx-react-lite"
import React, { useState } from "react"
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
import { ServiceAuthButton } from "../header/account/ServiceAuthButton"
import { GoogleBody } from "../header/account/services/GoogleBody"
import { ExternalServiceManagerContext } from "../header/ExternalServiceManagerContext"
import { loading } from "../icons/loading"

export function CollaborationModal() {
    const modal = useRequiredContext(ModalContext)
    const serviceManager = useRequiredContext(ExternalServiceManagerContext)

    const [isLoading, setLoading] = useState(false)
    const handleUnlink = async () => {
        setLoading(true)
        await serviceManager.unlink("Google")
        setLoading(false)
    }

    const isReady = Boolean(serviceManager.googleUser)

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
                    <ServiceAuthButton type="Google" />
                    {/* <ServiceAuthButton type="Discord" /> */}
                    <GoogleBody ready={isReady} externalServiceManager={serviceManager} />
                </Stack>
            </ModalBody>
            <ModalFooter>
                <PrimaryButton disabled={!isReady} onClick={handleUnlink} accent="danger">
                    Logout
                    {" "}
                    {isLoading ? loading : null}
                </PrimaryButton>
                <PrimaryButton onClick={() => modal.dismiss()}>Close</PrimaryButton>
            </ModalFooter>
        </ModalContainer>
    ))
}
