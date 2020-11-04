import { useObserver } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { Button } from "../../common/input/Button"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { EditorManagerContext } from "../editor/EditorManagerContext"
import { MessagePreview } from "./MessagePreview"

export const PostPreviewContainer = styled.div`
  position: relative;
  grid-area: preview;
  overflow-y: scroll;
`

export const PostPreview = () => {
  const editorManager = useRequiredContext(EditorManagerContext)

  return useObserver(() => (
    <PostPreviewContainer>
      {[...editorManager.allMessages.entries()].map(([id, msg], i) => (
        <MessagePreview
          key={id}
          message={msg}
          index={i}
          editorManager={editorManager}
        />
      ))}
      <Button
        onClick={editorManager.handleAdd}
        disabled={editorManager.allMessages.size >= editorManager.maxMessages}
      >
        Add more
      </Button>
    </PostPreviewContainer>
  ))
}
