import { tint } from "polished"
import styled from "styled-components"
import { PrimaryButton } from "../../../common/input/button/PrimaryButton"

export const LoginContainer = styled.div`
  display: flex;
  align-items: center; 
  flex-wrap: wrap;
  justify-content: center;
`

export const LoginInfo = styled.div`
  flex: 1 1 175px;
`

export const PrimaryIconButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  padding: 0 9px;
  min-width: unset;
  & > * {
    margin: 0 3px;
  }
`

const LoginButton = styled(PrimaryIconButton)`
  padding: 0;
  width: 180px;

  & > span {
    margin: 0 auto;
  }

  & > :is(img, svg) {
    margin: 0;
  }
`

export const DiscordLoginButton = styled(LoginButton)``

export const GoogleLoginButton = styled(LoginButton)`
  background-color: #4285f4;
  border-color: #4285f4;
  &:hover {
    background-color: ${tint(0.2, "#4285F4")};
    border-color: ${tint(0.2, "#4285F4")};
  }
`
