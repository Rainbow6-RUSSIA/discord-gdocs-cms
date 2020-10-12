import { useObserver } from "mobx-react-lite"
import React from "react"
import { Button } from "../../../../common/input/Button"
import type { ExternalServiceManagerProp } from "../BaseAccountModal"

export function DiscordBody({
  externalServiceManager,
}: ExternalServiceManagerProp) {
  return useObserver(() => "DiscordBody")
}
