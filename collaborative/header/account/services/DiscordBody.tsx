import { useObserver } from "mobx-react-lite"
import React, { useState } from "react"
import { Button } from "../../../../common/input/button/Button"
import { InputField } from "../../../../common/input/text/InputField"
import { FlexContainer } from "../../../../common/layout/FlexContainer"
import type { AccountModalProp } from "../BaseAccountModal"

export function DiscordBody({ externalServiceManager }: AccountModalProp) {
  const user = externalServiceManager.discordUser!
  const [value, setValue] = useState(`${user.username}#${user.discriminator}`)
  return useObserver(() => (
    <FlexContainer>
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
