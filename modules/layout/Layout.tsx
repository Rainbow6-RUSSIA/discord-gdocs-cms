import { useObserver } from "mobx-react-lite"
import React from "react"
import styled, { useTheme } from "styled-components"
import { Editor } from "../editor/Editor"
import { Header } from "../header/Header"
import { TabBar } from "../header/Tabs"
import { PostPreview } from "../message/PostPreview"

const DesktopGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    "header header header"
    "tab-bar tab-bar tab-bar"
    "editor . preview";
  /* gap: 5px 5px; */
`

const MobileGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    "navigation login"
    "tab-bar tab-bar"
    "editor preview";
`

export const GridLayout = () => {
  const theme = useTheme()
  const ChosenLayout = theme.appearance.mobile ? MobileGrid : DesktopGrid
  return useObserver(() => (
    <ChosenLayout translate="no">
      <Header />
      <TabBar />
      <Editor />
      <PostPreview />
    </ChosenLayout>
  ))
}

/* <Login />
          
          {mobile && (
            
          )}
          <View>
            <div style={{ display: "flex" }}>
              {(!mobile || activeTab === "editor") && (
                <ScrollContainer>
                  <Editor />
                </ScrollContainer>
              )}
              {(!mobile || activeTab === "preview") && (
                <ScrollContainer>
                  
                </ScrollContainer>
              )}
            </div>
          </View> */
