import { useObserver } from "mobx-react-lite"
import Link from "next/link"
import React from "react"
import styled, { css } from "styled-components"
import { ModalManagerContext } from "../../common/modal/ModalManagerContext"
import { useRequiredContext } from "../../common/state/useRequiredContext"
import { AppearanceModal } from "../../common/style/AppearanceModal"

const Container = styled.header`
  display: flex;

  background: ${({ theme }) => theme.background.secondary};

  & > * {
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

const HeaderLink = styled.a`
  
`

export type HeaderProps = {
  // message: Message
  // className?: string
}

export function Header(/* props: HeaderProps */) {
  const modalManager = useRequiredContext(ModalManagerContext)
  return useObserver(() => (
    <Container>
      <Link passHref href="https://google.com">
        <HeaderLink rel="noopener">
          Support server
        </HeaderLink>
      </Link>
      <HeaderButton
        onClick={() =>
          modalManager.spawn({
            render: () => <AppearanceModal />,
          })
        }
      >
        Appearance
      </HeaderButton>
      <HeaderButton>Login via Discord</HeaderButton>
      <HeaderButton>Login via Google</HeaderButton>
    </Container>
  ))
}
