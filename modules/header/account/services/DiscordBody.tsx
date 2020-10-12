import { useObserver } from "mobx-react-lite"
import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "../../../../common/input/Button"
import { InputField } from "../../../../common/input/InputField"
import { FlexContainer } from "../../../editor/styles/FlexContainer"
import type { ExternalServiceManagerProp } from "../BaseAccountModal"

// const CreateBackupButton = styled(Button)`
//   width: 80px;
// `

export function DiscordBody({
  externalServiceManager,
}: ExternalServiceManagerProp) {
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
      > Save
      </Button>
    </FlexContainer>
  ))
}
