import React, { useContext } from "react"
import styled, { css } from "styled-components"
import { TabsContext } from "./TabsContext"

export const TabsContainer = styled.div`
  display: flex;

  background: ${({ theme }) => theme.background.secondary};
`

export const Tab = styled.button.attrs({ type: "button" })<{ active: boolean }>`
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

export const TabBar = () => {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  return (
    <>
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
    </>
  )
}
