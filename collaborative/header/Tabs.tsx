import React, { useContext } from "react"
import styled, { css } from "styled-components"
import { TabsContext } from "./TabsContext"

export const TabsContainer = styled.div`
  display: flex;
  grid-area: tabs;
  background: ${({ theme }) => theme.background.secondary};
`

export const Tab = styled.button.attrs({ type: "button" })<{ active: boolean }>`
  height: 42px;
  padding: 0 16px;

  background: none;
  border: solid transparent;
  border-width: 2px 0;
  border-radius: 0;
  flex-grow: 1;

  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.header.primary};
  line-height: 38px;
  border-top-color: ${({ theme }) => theme.accent.primary};

  ${({ active }) =>
    active &&
    css`
      border-bottom-color: ${({ theme }) => theme.accent.primary};
    `}
`

export const TabBar = () => {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  return (
    <TabsContainer>
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
    </TabsContainer>
  )
}