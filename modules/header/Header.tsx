import { useObserver } from "mobx-react-lite"
import dynamic from "next/dynamic"
import React from "react"
import type { DriveProps } from "react-drive"
import styled, { css } from "styled-components"
import { ModalManagerContext } from "../../common/modal/ModalManagerContext"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import type { BackupsModalProps } from "../database/backup/modal/BackupsModal"
import { EditorManagerContext } from "../editor/EditorManagerContext"
import { HeaderManagerContext } from "./HeaderManagerContext"

const AppearanceModal = dynamic<Record<never, unknown>>(async () =>
  import("../../common/style/AppearanceModal").then(
    module => module.AppearanceModal,
  ),
)

const BackupsModal = dynamic<BackupsModalProps>(async () =>
  import("../database/backup/modal/BackupsModal").then(
    module => module.BackupsModal,
  ),
)

const Drive = dynamic<DriveProps>(async () => 
  import(process.browser ? "react-drive" : "./PickerStub").then(
      module => module.default,
  )
)

const Container = styled.header`
  display: flex;

  background: ${({ theme }) => theme.background.secondary};

  z-index: 1;

  & > * {
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

const HeaderLink = styled.a``

export type HeaderProps = {
  // message: Message
  // className?: string
}

export function Header(/* props: HeaderProps */) {
  const modalManager = useRequiredContext(ModalManagerContext)
  const editorManager = useRequiredContext(EditorManagerContext)
  const headerManager = useRequiredContext(HeaderManagerContext)

  return useObserver(() => (
    <Container>
      <HeaderLink href="https://google.com" rel="noopener">
        Support server
      </HeaderLink>
      <HeaderButton
        onClick={() =>
          modalManager.spawn({
            render: () => <AppearanceModal />,
          })
        }
      >
        Appearance
      </HeaderButton>
      <HeaderButton
        onClick={() =>
          modalManager.spawn({
            render: () => <BackupsModal editorManager={editorManager} />,
          })
        }
      >Backups</HeaderButton>

      <Drive
        clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
        onEvent={headerManager.handleEvent}
        allowedMimeTypes={["application/vnd.google-apps.spreadsheet"]}
        exportAsBlobs={false}
      >
        <HeaderButton>Picker</HeaderButton>
      </Drive>

      <HeaderButton>Login via Discord</HeaderButton>
      <HeaderButton>Login via Google</HeaderButton>
    </Container>
  ))
}
