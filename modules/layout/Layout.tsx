import { useObserver } from "mobx-react-lite"
import React, { CSSProperties, useContext, useState } from "react"
import styled, { useTheme } from "styled-components"
import { Editor } from "../editor/Editor"
import { Header } from "../header/Header"
import { TabBar } from "../header/Tabs"
import { TabsContext } from "../header/TabsContext"
import { PostPreview } from "../message/PostPreview"
import { Slider } from "./Slider"

const MainGrid = styled.div`
  height: 100vh;
  display: grid;
`

const DesktopGrid = styled(MainGrid)`
  grid-template-columns: var(--split) 5px calc(100% - var(--split));
  grid-template-rows: max-content auto;
  grid-template-areas:
    "header header header"
    "editor slider preview";
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
  const [split, setSplit] = useState(0.5)

  const isMobile = theme.appearance.mobile
  const ChosenLayout = isMobile ? MobileGrid : DesktopGrid

  return useObserver(() => (
    <ChosenLayout
      style={{ "--split": `${split * 100}%` } as CSSProperties}
      translate="no"
    >
      <Header />
      {isMobile && <TabBar />}
      {(!isMobile || activeTab === "editor") && <Editor />}
      {!isMobile && <Slider split={split} setSplit={setSplit} />}
      {(!isMobile || activeTab === "preview") && <PostPreview />}
    </ChosenLayout>
  ))
}
