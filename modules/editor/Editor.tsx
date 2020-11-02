import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { Button } from "../../common/input/Button"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { DARK_THEME } from "../../common/style/themes/darkTheme"
import { EditorManagerContext } from "./EditorManagerContext"
import { JsonInput } from "./JsonInput"
import { MessageEditor } from "./message/MessageEditor"
import { FlexContainer } from "./styles/FlexContainer"

export const EditorContainer = styled.div`
  position: relative;
`

const EditorInnerContainer = styled(FlexContainer)`
  display: block;
  /* height: 100%; */
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

const PageNumber = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
`

export function Editor() {
  const editorManager = useRequiredContext(EditorManagerContext)

  return useObserver(() => (
    <>
      <Button
        disabled={!editorManager.index}
        onClick={editorManager.handlePrevious}
      >
        Previous
      </Button>
      Message:{" "}
      <PageNumber>{`${editorManager.index + 1}/${
        editorManager.allMessages.size
      }`}</PageNumber>
      <Button
        disabled={editorManager.index === editorManager.allMessages.size - 1}
        onClick={editorManager.handleNext}
      >
        Next
      </Button>
      <EditorInnerContainer>
        <JavaScriptWarning>
          Discord GDocs CMS requires JavaScript to be enabled, please turn it on
          in your browser settings to use this app.
        </JavaScriptWarning>
        <MessageEditor />
        <JsonInput />
      </EditorInnerContainer>
    </>
  ))
}
