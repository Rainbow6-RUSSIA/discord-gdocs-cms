import { useObserver } from "mobx-react-lite"
import dynamic from "next/dynamic"
import Link from "next/link"
import React from "react"
import styled, { css } from "styled-components"
import { ModalManagerContext } from "../../common/modal/ModalManagerContext"
import { useRequiredContext } from "../../common/state/useRequiredContext"
// import type { BackupsModalProps } from "../database/backup/modal/BackupsModal"
// import { EditorManagerContext } from "../editor/EditorManagerContext"
import { ServiceAuthButton } from "./account/ServiceAuthButton"

const AppearanceModal = dynamic<Record<never, unknown>>(async () =>
  import("../../common/style/AppearanceModal").then(
    module => module.AppearanceModal,
  ),
)

// const BackupsModal = dynamic<BackupsModalProps>(async () =>
//   import("../database/backup/modal/BackupsModal").then(
//     module => module.BackupsModal,
//   ),
// )

const Container = styled.header`
  grid-area: header;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  background: ${({ theme }) => theme.background.secondary};

  z-index: 1;
`

const HeaderSubContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* margin-left: 10px; */

  & > * {
    align-self: center;
    padding: 0 16px;

    background: none;
    border: solid transparent;
    border-width: 2px 0;
    border-radius: 0;

    font-weight: 500;
    font-size: 15px;
    color: ${({ theme }) => theme.header.primary};
    line-height: 38px;

    &:hover {
      border-bottom-color: ${({ theme }) => theme.accent.primary};
      text-decoration: none;
    }
  }
`
// const Logo

const HeaderButton = styled.button.attrs({ type: "button" })<{
  active?: boolean
}>`
  ${({ active }) =>
    active &&
    css`
      border-bottom-color: ${({ theme }) => theme.accent.primary};
    `}
`

export type HeaderProps = {
  // message: Message
  // className?: string
}

function Navigation() {
  const modalManager = useRequiredContext(ModalManagerContext)

  return useObserver(() => (
    <HeaderSubContainer>
      <Link href="/discord">Support server</Link>
      <HeaderButton
        onClick={() =>
          modalManager.spawn({
            render: () => <AppearanceModal />,
          })
        }
      >
        Appearance
      </HeaderButton>
      {/* <HeaderButton
        onClick={() =>
          modalManager.spawn({
            render: () => <BackupsModal editorManager={editorManager} />,
          })
        }
      >
        Backups
      </HeaderButton> */}
    </HeaderSubContainer>
  ))
}

function Login() {
  // const editorManager = useRequiredContext(EditorManagerContext)

  return useObserver(() => (
    <HeaderSubContainer>
      <ServiceAuthButton type="Google" />
      <ServiceAuthButton type="Discord" />
    </HeaderSubContainer>
  ))
}

export function Header() {
  return (
    <Container>
      <Navigation />
      <Login />
    </Container>
  )
}
