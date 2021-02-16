import { toJS } from "mobx"
import { useObserver } from "mobx-react-lite"
import React from "react"
import { useQuery } from "react-query"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import type { PostsAPIResponce } from "../../../pages/api/google/posts"
import { fetchResource, optionMap } from "../../helpers/query"
import { Dropdown, DropdownOptions } from "../../layout/Dropdown"
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

    const optionsPosts: DropdownOptions = res ? res.data.map(optionMap) : []

    const selectPost = (e: React.ChangeEvent<HTMLSelectElement>) => {
        collaborationManager.post = res?.data.find(r => r.id === e.currentTarget.selectedOptions[0].value)
        collaborationManager.saveSettings()
        console.log(toJS(collaborationManager.post))
    }

    return useObserver(() => <>
        Select a post:
        <DropdownRow>
            <Dropdown
                onChange={selectPost}
                placeholder="none"
                loading={isLoading}
                options={optionsPosts}
            />
            <PrimaryButton>Create new</PrimaryButton>
        </DropdownRow>
    </>)
}