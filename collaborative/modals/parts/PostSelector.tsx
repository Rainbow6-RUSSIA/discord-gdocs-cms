import { useObserver } from "mobx-react-lite"
import React from "react"
import { useQuery } from "react-query"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import type { PostsAPIResponce } from "../../../pages/api/google/posts"
import { fetchResource } from "../../helpers/query"
import { Dropdown } from "../../layout/Dropdown"
import { DropdownRow } from "../../layout/DropdownRow"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"

export const PostSelector = () => {
    const collaborationManager = useRequiredContext(CollaborationManagerContext)

    const spreadsheetId = collaborationManager.spreadsheet?.id ?? ""
    const channelId = collaborationManager.channel?.id ?? ""
    
    const { data: res, isSuccess, isLoading } = useQuery(
        [spreadsheetId, channelId, "posts"],
        fetchResource<PostsAPIResponce>("/api/google/posts", { spreadsheetId, channelId })
    )
    return useObserver(() => <>
        Select a post:
        <DropdownRow>
            <Dropdown loading={isLoading} options={[]}/>
            <PrimaryButton>Create new</PrimaryButton>
        </DropdownRow>
    </>)
}