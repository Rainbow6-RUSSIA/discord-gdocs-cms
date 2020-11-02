import { useObserver } from "mobx-react-lite"
import React from "react"
import styled, { useTheme } from "styled-components"
import { Editor } from "../editor/Editor"
import { Login, Navigation } from "../header/Header"
import { TabBar } from "../header/Tabs"
import { PostPreview } from "../message/PostPreview"
import {
  GridNavigation,
  GridLogin,
  GridEditor,
  GridPreview,
  GridTabs,
} from "./GridCells"

const DesktopGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    "navigation login"
    "tab-bar tab-bar"
    "editor preview";
  gap: 5px 5px;
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

export const Layout = () => {
  const theme = useTheme()
  const ChosenLayout = theme.appearance.mobile ? MobileGrid : DesktopGrid
  return useObserver(() => (
    <ChosenLayout>
      <GridNavigation>
        <Navigation />
      </GridNavigation>
      <GridLogin>
        <Login />
      </GridLogin>
      <GridTabs>
        <TabBar />
      </GridTabs>
      <GridEditor>
        <Editor />
      </GridEditor>
      <GridPreview>
        <PostPreview />
      </GridPreview>
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
