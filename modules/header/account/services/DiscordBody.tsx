import { useObserver } from "mobx-react-lite"
import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "../../../../common/input/Button"
import { InputField } from "../../../../common/input/InputField"
import { FlexContainer } from "../../../editor/styles/FlexContainer"
import type { AccountModalProp } from "../BaseAccountModal"

export function DiscordBody({ externalServiceManager }: AccountModalProp) {
  const user = externalServiceManager.discordUser!
  const [value, setValue] = useState(`${user.username}#${user.discriminator}`)
  return useObserver(() => (
    <FlexContainer flow="row">
      <InputField
        id="backup-name"
        value={value}
        onChange={setValue}
        label="Backup name"
      />
      <Button
        disabled
        // onClick={}
      >
        {" "}
        Save
      </Button>
    </FlexContainer>
  ))
}
