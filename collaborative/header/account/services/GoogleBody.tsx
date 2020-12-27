import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { Button } from "../../../../common/input/button/Button"
import { FlexContainer } from "../../../../common/layout/FlexContainer"
import { externalLink } from "../../../icons/externalLink"
import { googleSheets } from "../../../icons/googleSheets"
import { BodyHeader } from "../AccountModalSectionHeader"
import type { AccountModalProp } from "../BaseAccountModal"
import GooglePicker from "../GooglePicker"

const Notice = styled.div`
  margin: 8px;

  line-height: 1.375;

  & > * {
    vertical-align: middle;
    margin-left: 3px;
  }

  & > a {
    line-height: 16px;
  }
`

export function GoogleBody({
  externalServiceManager,
  loading,
}: AccountModalProp) {
  return useObserver(() => {
    const user = externalServiceManager.googleUser!
    const {
      handleCreateNew,
      handleSheetSelection,
      handlePost,
      sheet,
    } = externalServiceManager

    return (
      <>
        <BodyHeader>Select spreadsheet</BodyHeader>
        <FlexContainer>
          <Button disabled={loading} onClick={handleCreateNew}>
            Create new
          </Button>
          <GooglePicker
            accessToken={user.accessToken}
            onEvent={handleSheetSelection}
          >
            <Button disabled={loading}>Pick existing</Button>
          </GooglePicker>
        </FlexContainer>
        <BodyHeader>Chosen spreadsheet</BodyHeader>
        <Notice>
          {sheet ? googleSheets : null}
          <span>{sheet ? sheet.name : "None"}</span>
          {sheet ? (
            <a target="_blank" rel="noreferrer" href={sheet.url}>
              {externalLink}
            </a>
          ) : null}
        </Notice>
        <Button disabled={!sheet} onClick={handlePost}>
          POST
        </Button>
      </>
    )
  })
}
