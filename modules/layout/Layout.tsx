import { useObserver } from "mobx-react-lite"
import React, { useContext } from "react"
import styled, { useTheme } from "styled-components"
import { Editor } from "../editor/Editor"
import { Header } from "../header/Header"
import { TabBar } from "../header/Tabs"
import { TabsContext } from "../header/TabsContext"
import { PostPreview } from "../message/PostPreview"

const MainGrid = styled.div`
  height: 100vh;
  display: grid;
`

const DesktopGrid = styled(MainGrid)`
  grid-template-columns: 1fr 1px 1fr;
  grid-template-rows: max-content auto;
  grid-template-areas:
    "header header header"
    "editor . preview";
`

const MobileGrid = styled(MainGrid)`
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content auto auto;
  grid-template-areas:
    "header"
    "tabs"
    "editor"
    "preview";
`

export const GridLayout = () => {
  const theme = useTheme()
  const { activeTab } = useContext(TabsContext)

  const isMobile = theme.appearance.mobile
  const ChosenLayout = isMobile ? MobileGrid : DesktopGrid

  return useObserver(() => (
    <ChosenLayout translate="no">
      <Header />
      {isMobile && <TabBar />}
      {(!isMobile || activeTab === "editor") && <Editor />}
      {(!isMobile || activeTab === "preview") && <PostPreview />}
    </ChosenLayout>
  ))
}
