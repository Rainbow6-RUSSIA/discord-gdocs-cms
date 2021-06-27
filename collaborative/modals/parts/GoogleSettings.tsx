import { useObserver } from "mobx-react-lite"
import React from "react"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { GoogleLoginButton, LoginContainer, LoginInfo } from "./Layout"

export function GoogleSettings() {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  return useObserver(() => {
    const google = collaborationManager.google
    return google ? (
      <>Google Settings here</>
    ) : (
      <LoginContainer>
        <LoginInfo>Login into a Google account for import, export and milestone saves to chosen spreadsheet. (Soon™)</LoginInfo>
        <GoogleLoginButton
          onClick={async () => collaborationManager.link("google")}
        >
          <img src="/static/google-button.svg" height={32} width={32} />
          <span>Sign in with Google</span>
        </GoogleLoginButton>
      </LoginContainer>
    )
  })
}
