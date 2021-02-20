import styled from "styled-components"
import { SCREEN_SMALL } from "../../common/layout/breakpoints"
import { CodeBlockContainer } from "../../modules/markdown/styles/CodeBlockContainer"

export const Container = styled.div`
  height: 100%;

  overflow: auto;

  padding: 32px;

  ${SCREEN_SMALL} {
    padding: 32px 16px;
  }
`

export const Header = styled.h1`
  margin: 0;

  color: ${({ theme }) => theme.header.primary};
  font-size: 28px;
`

export const Message = styled.p`
  margin: 16px 0;

  font-size: 16px;
  line-height: 1.375;
`

export const Details = styled(CodeBlockContainer)`
  max-width: 1200px;
  margin-bottom: 32px;
`
