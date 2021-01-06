import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { PrimaryButton } from "../../../../common/input/button/PrimaryButton"
import { ButtonRow } from "../../../../common/layout/ButtonRow"
import { FlexContainer } from "../../../../common/layout/FlexContainer"
import { externalLink } from "../../../icons/externalLink"
import { googleSheets } from "../../../icons/googleSheets"
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
  ready,
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
        Select spreadsheet
        <FlexContainer>
          <ButtonRow>
            <PrimaryButton disabled={!ready} onClick={handleCreateNew}>
              Create new
            </PrimaryButton>
            <GooglePicker
              accessToken={user && user.accessToken}
              onEvent={handleSheetSelection}
            >
              <PrimaryButton disabled={!ready}>Pick existing</PrimaryButton>
            </GooglePicker>
          </ButtonRow>
        </FlexContainer>
        Chosen spreadsheet
        <Notice>
          {sheet ? googleSheets : null}
          <span>{sheet ? sheet.name : "None"}</span>
          {sheet ? (
            <a target="_blank" rel="noreferrer" href={sheet.url}>
              {externalLink}
            </a>
          ) : null}
        </Notice>
        <PrimaryButton disabled={!sheet} onClick={handlePost}>
          POST
        </PrimaryButton>
      </>
    )
  })
}
