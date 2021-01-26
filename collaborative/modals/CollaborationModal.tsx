import type { drive_v3 } from "googleapis"
import { useObserver } from "mobx-react-lite"
import { signOut } from "next-auth/client"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
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
import { GoogleAuthButton } from "../account/ServiceAuthButton"
import { loading } from "../icons/loading"
import { Dropdown } from "../layout/Dropdown"
import { DropdownRow } from "../layout/DropdownRow"
import { CollaborationManagerContext } from "../manager/CollaborationManagerContext"
import type { ConnectionParams } from "../types"

type NonNullableObject<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};


export function CollaborationModal() {
    const modal = useRequiredContext(ModalContext)
    const collaborationManager = useRequiredContext(CollaborationManagerContext)

    const user = collaborationManager.session?.google
    
    const isReady = Boolean(user)

    const [isLoading, setLoading] = useState(false)
    const handleUnlink = async () => {
        setLoading(true)
        await collaborationManager.unlink()
        setLoading(false)
    }

    const fetchSpreadsheets = async (): Promise<NonNullableObject<drive_v3.Schema$File>[]> => {
        const res = await fetch("/api/google/spreadsheets")
        if (!res.ok) throw new Error("Network error")
        return res.json()
    }

    const fetchChannels = () => {

    }

    const fetchPosts = () => {

    }

    const resultSSs = useQuery("spreadsheets", fetchSpreadsheets, { enabled: Boolean(user) })
    const resultChannels = useQuery("channels", fetchChannels, { enabled: false })
    const resultPosts = useQuery("posts", fetchPosts, { enabled: false })
    
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
                    Select a spreadsheet:
                    <DropdownRow>
                        <Dropdown disabled={resultSSs.isIdle} loading={resultSSs.isLoading} options={resultSSs.data?.map(({ id, name }) => ({ label: name, value: id }))}/>
                        <PrimaryButton>Create new</PrimaryButton>
                    </DropdownRow>
                    Select Discord channel:
                    <Dropdown disabled={resultChannels.isIdle} loading={resultChannels.isLoading} options={[]}/>
                    Select a post:
                    <DropdownRow>
                        <Dropdown disabled={resultPosts.isIdle} loading={resultPosts.isLoading} options={[]}/>
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
