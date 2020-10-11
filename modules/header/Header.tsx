import { useObserver } from "mobx-react-lite"
import { useSession, signIn, signOut } from "next-auth/client"
import dynamic from "next/dynamic"
import React from "react"
import styled, { css } from "styled-components"
import { ModalManagerContext } from "../../common/modal/ModalManagerContext"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import type { CustomSession } from "../../types"
import type { BackupsModalProps } from "../database/backup/modal/BackupsModal"
import { EditorManagerContext } from "../editor/EditorManagerContext"
import { ServiceAuthButton } from "./dropdown/SocialTag"
import type { GooglePickerProps } from "./GooglePicker"
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

const GooglePicker = dynamic<GooglePickerProps>(async () =>
  import("./GooglePicker").then(module => module.default),
)

const Container = styled.header`
  display: flex;
  flex-wrap: wrap;

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
  }

  & > button {
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

  const [session, loading] = (useSession() as unknown) as [
    CustomSession | null,
    boolean,
  ]
  console.log(session, loading)

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
      >
        Backups
      </HeaderButton>

      {!loading && session?.google ? (
        <GooglePicker
          accessToken={session.google.accessToken}
          onEvent={headerManager.handlePickerEvent}
        >
          <HeaderButton>Select Spreadsheet</HeaderButton>
        </GooglePicker>
      ) : null}

      <ServiceAuthButton
        type="google"
        profile={session?.google}
        handleSignIn={() => signIn("google")}
        handleUnlink={console.log}
      />
      <ServiceAuthButton
        type="discord"
        profile={session?.discord}
        handleSignIn={() => signIn("discord")}
        handleUnlink={console.log}
      />

      <HeaderButton onClick={() => signOut()}>Logout</HeaderButton>
    </Container>
  ))
}
