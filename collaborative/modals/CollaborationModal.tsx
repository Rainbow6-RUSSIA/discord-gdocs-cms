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
import type { ChannelsAPIResponce } from "../../pages/api/google/channels"
import type { PostsAPIResponce } from "../../pages/api/google/posts"
import type { SpreadsheetsAPIResponce } from "../../pages/api/google/spreadsheets"
import { GoogleAuthButton } from "../account/ServiceAuthButton"
import { loading } from "../icons/loading"
import { Dropdown, DropdownOptions } from "../layout/Dropdown"
import { DropdownRow } from "../layout/DropdownRow"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"

const optionMap = ({ id, name }: { id: string, name: string }) => ({ label: name, value: id });

function fetchResource<T> (path: string, query: Record<string, string> = {}) {
    return async (): Promise<T> => {
        const res = await fetch(`${path}?${new URLSearchParams(query)}`)
        if (!res.ok) throw new Error(`Query error @ ${path}`)
        return res.json()
    }
}

export function CollaborationModal() {
    const modal = useRequiredContext(ModalContext)
    const collaborationManager = useRequiredContext(CollaborationManagerContext)

    const user = collaborationManager.session?.google
    const spreadsheetId = collaborationManager.spreadsheet?.id ?? ""
    const channelId = collaborationManager.channel?.id ?? ""

    const { isLoading: isUnlinking, mutate: handleUnlink } = useMutation(collaborationManager.unlink)

    const { data: spreadsheetsInfo, isSuccess: spreadsheetsSuccess, isLoading: spreadsheetsLoading } = useQuery(
        "spreadsheets",
        fetchResource<SpreadsheetsAPIResponce>("/api/google/spreadsheets"),
        { enabled: Boolean(user) }
    )
    const { data: channelsInfo, isSuccess: channelsSuccess, isLoading: channelsLoading } = useQuery(
        [spreadsheetId, "channels"],
        fetchResource<ChannelsAPIResponce>("/api/google/channels", { spreadsheetId }),
        { enabled: Boolean(spreadsheetsSuccess && spreadsheetId) }
    )
    const { data: postsInfo, isSuccess: postsSuccess, isLoading: postsLoading } = useQuery(
        [spreadsheetId, channelId, "posts"],
        fetchResource<PostsAPIResponce>("/api/google/posts", { spreadsheetId, channelId }),
        { enabled: Boolean(channelsSuccess && channelId) }
    )

    console.log(spreadsheetsInfo)
    const optionsSpreadsheets: DropdownOptions = spreadsheetsInfo ? [
        { group: spreadsheetsInfo.data.filter(f => f.starred).map(optionMap), name: "Starred" },
        ...spreadsheetsInfo.data.filter(f => !f.starred).map(optionMap)
    ] : []

    const optionsChannels: DropdownOptions = channelsInfo ? channelsInfo.data.map(ch => ({ ...ch, name: `#${ch.name}`})).map(optionMap) : []
    
    const selectSpreadsheet = (e: React.ChangeEvent<HTMLSelectElement>) => {
        collaborationManager.spreadsheet = spreadsheetsInfo?.data.find(r => r.id === e.currentTarget.selectedOptions[0].value)
        console.log(collaborationManager.spreadsheet)
    }

    const selectChannel = (e: React.ChangeEvent<HTMLSelectElement>) => {
        collaborationManager.channel = channelsInfo?.data.find(r => r.id === e.currentTarget.selectedOptions[0].value)
        console.log(collaborationManager.channel)
    }
    
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
                            <Dropdown
                                onChange={selectSpreadsheet}
                                placeholder="none"
                                loading={spreadsheetsLoading}
                                options={optionsSpreadsheets}
                            />
                            <PrimaryButton>Create new</PrimaryButton>
                        </DropdownRow>
                        { Boolean(collaborationManager.spreadsheet) && <>
                            Select Discord channel:
                            <Dropdown
                                onChange={selectChannel}
                                placeholder="none"
                                loading={channelsLoading}
                                options={optionsChannels}
                            />
                            { Boolean(collaborationManager.channel) && <>
                                Select a post:
                                <DropdownRow>
                                    <Dropdown loading={postsLoading} options={[]}/>
                                    <PrimaryButton>Create new</PrimaryButton>
                                </DropdownRow>
                            </> }
                        </> }
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
