import { useObserver } from "mobx-react-lite"
import type { GetServerSidePropsContext } from "next"
import React, { useEffect, useState } from "react"
import styled, { css, ThemeProvider } from "styled-components"
import { PageHead } from "../common/PageHead"
import { useLazyValue } from "../common/state/useLazyValue"
import { useRequiredContext } from "../common/state/useRequiredContext"
import { AppearanceManagerContext } from "../common/style/AppearanceManagerContext"
import { Editor } from "../modules/editor/Editor"
import { EditorManager } from "../modules/editor/EditorManager"
import { EditorManagerProvider } from "../modules/editor/EditorManagerContext"
import { ExternalServiceManager } from "../modules/header/ExternalServiceManager"
import { ExternalServiceManagerProvider } from "../modules/header/ExternalServiceManagerContext"
import { Header } from "../modules/header/Header"
import type { MessageData } from "../modules/message/data/MessageData"
import { INITIAL_MESSAGE_DATA } from "../modules/message/initialMessageData"
import { MessagePreview } from "../modules/message/MessagePreview"

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 95%;
`

const TabSwitcher = styled.div`
  display: flex;

  background: ${({ theme }) => theme.background.secondary};

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`

const Tab = styled.button.attrs({ type: "button" })<{ active: boolean }>`
  height: 40px;
  padding: 0 16px;

  background: none;
  border: solid transparent;
  border-width: 2px 0;
  border-radius: 0;

  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.header.primary};
  line-height: 38px;

  ${({ active }) =>
    active &&
    css`
      border-bottom-color: ${({ theme }) => theme.accent.primary};
    `}
`

const View = styled.main`
  display: flex;
  flex-direction: row-reverse;
  align-items: stretch;

  flex: 1;

  max-height: 100%;

  & > * {
    flex: 1;
  }

  ${({ theme }) =>
    theme.appearance.mobile &&
    css`
      margin: 40px 0 0;
      max-height: calc(100% - 40px);
    `}
`

const ScrollContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
`

const Preview = styled(MessagePreview)`
  flex: 0 0 auto;
`

export type MainProps = {
  messages: MessageData[]
  mobile: boolean
}

export default function Main(props: MainProps) {
  const { messages, mobile } = props

  const editorManager = useLazyValue(() => new EditorManager(messages))
  const externalServiceManager = useLazyValue(
    () => new ExternalServiceManager(),
  )

  // const cancelRef = useRef<() => void>()
  // useAutorun(() => {
  //   const message = editorManager.message.getMessageData()
  //   const json = JSON.stringify({ message: { ...message, files: undefined } })
  //   const base64 = base64UrlEncode(json)
  //   const { current: cancel } = cancelRef
  //   if (cancel) cancel()
  //   cancelRef.current = timeout(async () => {
  //     if (Router.query.message !== base64) {
  //       await Router.replace(`/?message=${base64}`, `/?message=${base64}`, {
  //         shallow: true,
  //       })
  //     }
  //   }, 500)
  // })

  const appearanceManager = useRequiredContext(AppearanceManagerContext)
  useEffect(() => {
    appearanceManager.mobile = mobile
  }, [appearanceManager, mobile])

  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview")

  // useWindowEvent("beforeunload", event => {
  //   event.preventDefault()
  //   event.returnValue = ""
  // })

  return useObserver(() => (
    <ThemeProvider
      theme={theme => ({
        ...theme,
        appearance: { ...theme.appearance, mobile },
      })}
    >
      <EditorManagerProvider value={editorManager}>
        <PageHead
          title="Discohook | A message and embed generator for Discord webhooks"
          description="An easy-to-use tool for building and sending Discord messages and embeds using webhooks."
        >
          <meta key="referrer" name="referrer" content="strict-origin" />
        </PageHead>
        <Container translate="no">
          <ExternalServiceManagerProvider value={externalServiceManager}>
            <Header />
          </ExternalServiceManagerProvider>
          {mobile && (
            <TabSwitcher>
              <Tab
                active={activeTab === "editor"}
                onClick={() => setActiveTab("editor")}
              >
                Editor
              </Tab>
              <Tab
                active={activeTab === "preview"}
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </Tab>
            </TabSwitcher>
          )}
          <View>
            {(!mobile || activeTab === "preview") && (
              <ScrollContainer>
                {[...editorManager.allMessages.entries()].map(
                  ([id, msg], i) => (
                    <Preview
                      clickHandler={() => {
                        setActiveTab("editor")
                        editorManager.index = i
                      }}
                      first={i === 0}
                      key={id}
                      message={msg}
                    />
                  ),
                )}
              </ScrollContainer>
            )}
            {(!mobile || activeTab === "editor") && (
              <ScrollContainer>
                <Editor />
              </ScrollContainer>
            )}
          </View>
        </Container>
      </EditorManagerProvider>
    </ThemeProvider>
  ))
}

export const getServerSideProps = (
  context: GetServerSidePropsContext,
): { props: MainProps } => {
  const messages = new Array(5)
    .fill(null)
    .map(() => ({ ...INITIAL_MESSAGE_DATA, content: Math.random().toString() }))

  const mobile = /mobile/i.test(context.req.headers["user-agent"] ?? "")

  return {
    props: {
      messages,
      mobile,
    },
  }
}
