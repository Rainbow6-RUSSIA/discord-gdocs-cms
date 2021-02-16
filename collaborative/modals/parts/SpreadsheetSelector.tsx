import { toJS } from "mobx"
import { useObserver } from "mobx-react-lite"
import React from "react"
import { useQuery } from "react-query"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import type { SpreadsheetsAPIResponce } from "../../../pages/api/google/spreadsheets"
import { fetchResource, optionMap } from "../../helpers/query"
import { Dropdown, DropdownOptions } from "../../layout/Dropdown"
import { DropdownRow } from "../../layout/DropdownRow"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { ChannelSelector } from "./ChannelSelector"

// TODO: option processor
// mark saved selection stale if doesn't received

export const SpreadsheetSelector = () => {
    const collaborationManager = useRequiredContext(CollaborationManagerContext)

    const { data: res, isSuccess, isLoading } = useQuery(
        "spreadsheets",
        fetchResource<SpreadsheetsAPIResponce>("/api/google/spreadsheets")
    )

    const selectSpreadsheet = (e: React.ChangeEvent<HTMLSelectElement>) => {
        collaborationManager.spreadsheet = res?.data.find(r => r.id === e.currentTarget.selectedOptions[0].value)
        collaborationManager.saveSettings()
        console.log(toJS(collaborationManager.spreadsheet))
    }

    const optionsSpreadsheets: DropdownOptions = res ? [
        { group: res.data.filter(f => f.starred).map(optionMap), name: "Starred" },
        ...res.data.filter(f => !f.starred).map(optionMap)
    ] : []

    return useObserver(() => <>
        Select a spreadsheet:
        <DropdownRow>
            <Dropdown
                onChange={selectSpreadsheet}
                placeholder="none"
                loading={isLoading}
                options={optionsSpreadsheets}
            />
            <PrimaryButton>Create new</PrimaryButton>
        </DropdownRow>
        { Boolean(isSuccess && collaborationManager.spreadsheet) && <ChannelSelector/> }
    </> )
}