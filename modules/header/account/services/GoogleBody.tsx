import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { ExternalLinkIcon } from "../../../../common/icons/ExternalLink"
import { Button } from "../../../../common/input/Button"
import GSheetsSvg from "../../../../public/static/google-sheets.svg"
import { FlexContainer } from "../../../editor/styles/FlexContainer"
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
      sheet,
    } = externalServiceManager

    return (
      <>
        <BodyHeader>Select spreadsheet</BodyHeader>
        <FlexContainer flow="row">
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
          {sheet ? <GSheetsSvg /> : null}
          <span>{sheet ? sheet.name : "None"}</span>
          {sheet ? (
            <a target="_blank" rel="noreferrer" href={sheet.url}>
              <ExternalLinkIcon />
            </a>
          ) : null}
        </Notice>
      </>
    )
  })
}
