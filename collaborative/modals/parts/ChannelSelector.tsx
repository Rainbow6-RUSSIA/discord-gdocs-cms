import { toJS } from "mobx"
import { useObserver } from "mobx-react-lite"
import React from "react"
import { useQuery } from "react-query"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import type { ChannelsAPIResponce } from "../../../pages/api/google/channels"
import { fetchResource, optionMap } from "../../helpers/query"
import { Dropdown, DropdownOptions } from "../../layout/Dropdown"
import { DropdownRow } from "../../layout/DropdownRow"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { PostSelector } from "./PostSelector"

export const ChannelSelector = () => {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  const spreadsheetId = collaborationManager.spreadsheet?.id ?? ""

  const { data: res, isSuccess, isLoading } = useQuery(
    [spreadsheetId, "channels"],
    fetchResource<ChannelsAPIResponce>("/api/google/channels", {
      spreadsheetId,
    }),
  )

  const optionsChannels: DropdownOptions = res
    ? res.data.map(ch => ({ ...ch, name: `#${ch.name}` })).map(optionMap)
    : []

  const selectChannel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    collaborationManager.channel = res?.data.find(
      r => r.id === e.currentTarget.selectedOptions[0].value,
    )
    collaborationManager.saveSettings()
    console.log(toJS(collaborationManager.channel))
  }

  return useObserver(() => (
    <>
      Select Discord channel:
      <Dropdown
        onChange={selectChannel}
        placeholder="none"
        loading={isLoading}
        options={optionsChannels}
      />
      {isSuccess && collaborationManager.channel && <PostSelector />}
    </>
  ))
}
