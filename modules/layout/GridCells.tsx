import styled from "styled-components"
import { EditorContainer } from "../editor/Editor"
import { HeaderContainer } from "../header/Header"
import { TabsContainer } from "../header/Tabs"
import { PostPreviewContainer } from "../message/PostPreview"

export const GridNavigation = styled(HeaderContainer)`
  grid-area: navigation;
`
export const GridLogin = styled(HeaderContainer)`
  grid-area: login;
  justify-content: flex-end;
`
export const GridEditor = styled(EditorContainer)`
  grid-area: editor;
  overflow-y: scroll;
  /* position: relative; */
`
export const GridPreview = styled(PostPreviewContainer)`
  grid-area: preview;
  overflow-y: scroll;
  /* position: relative; */
`
export const GridTabs = styled(TabsContainer)`
  grid-area: tab-bar;
`
