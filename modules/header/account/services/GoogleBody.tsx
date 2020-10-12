import { useObserver } from "mobx-react-lite"
import React from "react"
import { Button } from "../../../../common/input/Button"
import type { ExternalServiceManagerProp } from "../BaseAccountModal"

export function GoogleBody({
  externalServiceManager,
}: ExternalServiceManagerProp) {
  return useObserver(() => "GoogleBody")
}
