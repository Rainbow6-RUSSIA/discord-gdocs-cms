import type { drive_v3 } from "googleapis"
import { useObserver } from "mobx-react-lite"
import React from "react"
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
import { GoogleAuthButton } from "../account/ServiceAuthButton"
import { loading } from "../icons/loading"
import { Dropdown, DropdownOptions } from "../layout/Dropdown"
import { DropdownRow } from "../layout/DropdownRow"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import type { ConnectionParams } from "../types"

type NonNullableObject<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

const fileMap = ({ id, name }: NonNullableObject<drive_v3.Schema$File>) => ({ label: name, value: id });

export function CollaborationModal() {
    const modal = useRequiredContext(ModalContext)
    const collaborationManager = useRequiredContext(CollaborationManagerContext)

    const user = collaborationManager.session?.google

    const { isLoading: isUnlinking, mutate: handleUnlink } = useMutation(collaborationManager.unlink)

    const fetchSpreadsheets = async (): Promise<NonNullableObject<drive_v3.Schema$File>[]> => {
        const res = await fetch("/api/google/spreadsheets")
        if (!res.ok) throw new Error("Query error")
        return res.json()
    }

    const fetchChannels = () => {

    }

    const fetchPosts = () => {

    }

    const resultSSs = useQuery("spreadsheets", fetchSpreadsheets, { enabled: Boolean(user) })
    const resultChannels = useQuery("channels", fetchChannels, { enabled: false })
    const resultPosts = useQuery("posts", fetchPosts, { enabled: false })

    const optionsSpreadsheets: DropdownOptions = resultSSs.data ? [
        { group: resultSSs.data.filter(f => f.starred).map(fileMap), name: "Starred" },
        ...resultSSs.data.filter(f => !f.starred).map(fileMap)
    ] : []
    
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
                    <GoogleAuthButton />
                    { Boolean(user) && <>
                        Select a spreadsheet:
                        <DropdownRow>
                            <Dropdown onChange={e => console.log(e.currentTarget.selectedOptions[0])} placeholder="none" disabled={resultSSs.isIdle} loading={resultSSs.isLoading} options={optionsSpreadsheets}/>
                            <PrimaryButton>Create new</PrimaryButton>
                        </DropdownRow>
                        Select Discord channel:
                        <Dropdown disabled={resultChannels.isIdle} loading={resultChannels.isLoading} options={[]}/>
                        Select a post:
                        <DropdownRow>
                            <Dropdown disabled={resultPosts.isIdle} loading={resultPosts.isLoading} options={[]}/>
                            <PrimaryButton>Create new</PrimaryButton>
                        </DropdownRow>
                    </> }
                </Stack>
            <div style={{display: "inline"}}><ReactQueryDevtools initialIsOpen/></div>
            </ModalBody>
            <ModalFooter>
                { Boolean(user) &&
                    <PrimaryButton onClick={() => handleUnlink()} accent="danger">
                        {"Logout "}
                        {isUnlinking ? loading : null}
                    </PrimaryButton> }
                <PrimaryButton onClick={() => modal.dismiss()}>Close</PrimaryButton>
            </ModalFooter>
        </ModalContainer>
    ))
}
