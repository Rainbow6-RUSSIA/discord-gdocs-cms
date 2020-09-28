import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { DARK_THEME } from "../../common/style/themes/darkTheme"
import { JsonInput } from "./JsonInput"
import { MessageEditor } from "./message/MessageEditor"
import { FlexContainer } from "./styles/FlexContainer"
import { WebhookControls } from "./webhook/WebhookControls"

const EditorContainer = styled.div`
  position: relative;
`

const EditorInnerContainer = styled(FlexContainer)`
  display: block;
  height: 100%;
  padding: 8px;

  & > *:not(button) {
    flex-grow: 0;
  }
`

const JavaScriptWarning = styled.noscript`
  display: block;

  margin: -8px -8px 16px;
  padding: 16px;
  background: ${({ theme }) => theme.accent.danger};
  color: ${DARK_THEME.header.primary};
`

export function Editor() {
  return useObserver(() => (
    <EditorContainer>
      <EditorInnerContainer>
        <JavaScriptWarning>
          Discohook requires JavaScript to be enabled, please turn it on in your
          browser settings to use this app.
        </JavaScriptWarning>
        <WebhookControls />
        <MessageEditor />
        <JsonInput />
      </EditorInnerContainer>
    </EditorContainer>
  ))
}
