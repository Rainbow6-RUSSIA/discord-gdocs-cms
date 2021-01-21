import { useObserver } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { PrimaryButton } from "../../common/input/button/PrimaryButton"
import { ButtonRow } from "../../common/layout/ButtonRow"
import { FlexContainer } from "../../common/layout/FlexContainer"
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
import GooglePicker from "../header/account/GooglePicker"
import { ServiceAuthButton } from "../header/account/ServiceAuthButton"
import { externalLink } from "../icons/externalLink"
import { googleSheets } from "../icons/googleSheets"
import { loading } from "../icons/loading"
import { Dropdown } from "../layout/Dropdown"
import { DropdownRow } from "../layout/DropdownRow"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"

const Notice = styled.div`
  margin: 8px;

  line-height: 1.375;

  & > * {
    vertical-align: middle;
    margin-left: 3px;
  }

  & > a {
    line-height: 16px;
  }
`

export function CollaborationModal() {
    const modal = useRequiredContext(ModalContext)
    const collaborationManager = useRequiredContext(CollaborationManagerContext)

    const user = collaborationManager.googleUser
    const {
      handleCreateNew,
      handleSheetSelection,
      handlePost,
      sheet,
    } = collaborationManager
    
    const isReady = Boolean(user)

    const [isLoading, setLoading] = useState(false)
    const handleUnlink = async () => {
        setLoading(true)
        await collaborationManager.unlink("Google")
        setLoading(false)
    }

    // const [] = useState(null)

    // useEffect(() => {

    // }, [])

    const googlePickButton = <PrimaryButton disabled={!isReady}>Pick existing</PrimaryButton>

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
                    Select spreadsheet
                    <FlexContainer>
                    <ButtonRow>
                        <PrimaryButton disabled={!isReady} onClick={handleCreateNew}>
                        Create new
                        </PrimaryButton>
                        {user?.accessToken
                        ? <GooglePicker accessToken={user.accessToken} onEvent={handleSheetSelection}>
                            {googlePickButton}
                        </GooglePicker>
                        : googlePickButton
                        }
                        
                    </ButtonRow>
                    </FlexContainer>
                    Chosen spreadsheet
                    <Notice>
                    {sheet ? googleSheets : null}
                    <span>{sheet ? sheet.name : "None"}</span>
                    {sheet ? (
                        <a target="_blank" rel="noreferrer" href={sheet.url}>
                        {externalLink}
                        </a>
                    ) : null}
                    </Notice>
                    Select Discord channel:
                    <Dropdown options={[]}/>
                    Select post:
                    <DropdownRow>
                        <Dropdown options={[]}/>
                        <PrimaryButton>Create new</PrimaryButton>
                    </DropdownRow>
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
