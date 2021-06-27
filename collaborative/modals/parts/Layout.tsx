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

export const LoginButton = styled(PrimaryButton)`
  width: 175px;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 5px;
  & > span {
    margin: 0 3px;
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
