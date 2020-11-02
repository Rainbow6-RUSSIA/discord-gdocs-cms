import { Observer, useObserver } from "mobx-react-lite"
import dynamic from "next/dynamic"
import { rem } from "polished"
import React, { useContext } from "react"
import styled, { css, useTheme } from "styled-components"
import { SCREEN_SMALL } from "../../common/breakpoints"
import DeleteSvg from "../../public/static/unlink.svg"
import type { EditorManager } from "../editor/EditorManager"
import { TabsContext } from "../header/TabsContext"
import { Markdown } from "../markdown/Markdown"
import { MarkdownContainer } from "../markdown/styles/MarkdownContainer"
import type { Message } from "./Message"
import type { AttachmentProps } from "./preview/attachment/Attachment"
import { MessageHeader } from "./preview/MessageHeader"
import { RichEmbed } from "./preview/RichEmbed"

const Attachment = dynamic<AttachmentProps>(async () =>
  import("./preview/attachment/Attachment").then(module => module.Attachment),
)

const Container = styled.div<{ first: boolean }>`
  position: relative;

  margin-top: ${props => (props.first ? rem(16) : rem(3))};

  ${({ theme }) =>
    theme.appearance.display === "cozy" &&
    css`
      padding: ${rem(2)} 16px ${rem(2)} ${rem(72)};

      /* min-height: ${rem(44)}; */

      ${({ theme }) =>
        theme.appearance.fontSize > 16 &&
        css`
          padding-left: 72px;
        `};

      ${SCREEN_SMALL} {
        padding-left: 16px;
      }
    `};

  ${({ theme }) =>
    theme.appearance.display === "compact" &&
    css`
      padding: ${rem(2)} ${rem(16)} ${rem(2)} 80px;

      /* min-height: ${rem(22)}; */

      text-indent: calc(${rem(16)} - 80px);

      & > ${MarkdownContainer} {
        display: inline;
      }
    `}

  &:hover {
    background-color: ${props => props.theme.backgroundModifier.hover};
  }

  &:hover > svg {
    display: block;
  }
`

const ExtrasContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  row-gap: ${rem(4)};

  padding: ${rem(2)} 0;

  text-indent: 0;

  & > * {
    justify-self: start;
    align-self: start;
  }
`

export const DeleteIcon = styled(DeleteSvg)`
  position: absolute;
  right: ${rem(4)};
  top: ${rem(4)};
  display: none;
  zoom: 1.25;
`

export type MessagePreviewProps = {
  message: Message
  index: number
  editorManager: EditorManager

  className?: string
}

export function MessagePreview(props: MessagePreviewProps) {
  const { message, index, editorManager, className } = props
  const theme = useTheme()
  const isFirst = index === 0
  const { setActiveTab } = useContext(TabsContext)

  return useObserver(() => (
    <Container
      onClick={() => {
        setActiveTab("editor")
        editorManager.index = index
      }}
      first={isFirst}
      className={className}
    >
      {(isFirst || theme.appearance.display === "compact") && (
        <MessageHeader username={message.username} avatarUrl={message.avatar} />
      )}
      {message.hasContent && (
        <Observer>
          {() => <Markdown content={message.content} type="message-content" />}
        </Observer>
      )}
      {message.hasExtras && (
        <ExtrasContainer>
          {[
            ...message.files.map(file => (
              <Attachment key={`a:${file.name}`} file={file} />
            )),
            ...message.embeds.map(embed => (
              <RichEmbed key={`e:${embed.id}`} embed={embed} />
            )),
          ]}
        </ExtrasContainer>
      )}
      {editorManager.allMessages.size > 1 && (
        <DeleteIcon
          onClick={e => {
            editorManager.handleRemove(index)
            e.stopPropagation() // don't trigger whole preview click
          }}
        />
      )}
    </Container>
  ))
}
