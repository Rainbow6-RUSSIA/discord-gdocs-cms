import { useObserver } from "mobx-react-lite"
import type { GetServerSidePropsContext } from "next"
import React, { useEffect, useState } from "react"
import styled, { ThemeProvider } from "styled-components"
import { PageHead } from "../common/PageHead"
import { useLazyValue } from "../common/state/useLazyValue"
import { useRequiredContext } from "../common/state/useRequiredContext"
import { AppearanceManagerContext } from "../common/style/AppearanceManagerContext"
import { EditorManager } from "../modules/editor/EditorManager"
import { EditorManagerProvider } from "../modules/editor/EditorManagerContext"
import { ExternalServiceManager } from "../modules/header/ExternalServiceManager"
import { ExternalServiceManagerProvider } from "../modules/header/ExternalServiceManagerContext"
import { TabsContext } from "../modules/header/TabsContext"
import { Layout } from "../modules/layout/Layout"
import type { MessageData } from "../modules/message/data/MessageData"
import { INITIAL_MESSAGE_DATA } from "../modules/message/initialMessageData"

const Container = styled.div`
  /* display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
  width: 100%;
  & > * {
    flex-basis: 5%;
  } */
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

  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview")

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
  // useWindowEvent("beforeunload", event => {
  //   event.preventDefault()
  //   event.returnValue = ""
  // })

  const appearanceManager = useRequiredContext(AppearanceManagerContext)
  useEffect(() => {
    appearanceManager.mobile = mobile
  }, [appearanceManager, mobile])

  return useObserver(() => (
    <ThemeProvider
      theme={theme => ({
        ...theme,
        appearance: { ...theme.appearance, mobile },
      })}
    >
      <EditorManagerProvider value={editorManager}>
        <ExternalServiceManagerProvider value={externalServiceManager}>
          <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <PageHead
              title="Discohook | A message and embed generator for Discord webhooks"
              description="An easy-to-use tool for building and sending Discord messages and embeds using webhooks."
            >
              <meta key="referrer" name="referrer" content="strict-origin" />
            </PageHead>
            <Container translate="no">
              <Layout />
            </Container>
          </TabsContext.Provider>
        </ExternalServiceManagerProvider>
      </EditorManagerProvider>
    </ThemeProvider>
  ))
}

export const getServerSideProps = (
  context: GetServerSidePropsContext,
): { props: MainProps } => {
  const messages = new Array(3)
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
