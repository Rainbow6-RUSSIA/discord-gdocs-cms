import { useObserver } from "mobx-react-lite"
import { signIn } from "next-auth/client"
import React from "react"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { GoogleLoginButton } from "./Layout"

export function GoogleSettings() {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  return useObserver(() => {
    const google = collaborationManager.google
    return google ? (
      <>Google Settings here</>
    ) : (
      <>
        You can also login into a Google account to select spreadsheet for
        import, export and milestone saves. (Soon™)
        <GoogleLoginButton
          onClick={async () => collaborationManager.link("google")}
        >
          <img src="/static/google-button.svg" height={32} width={32} />
          <span>Sign in with Google</span>
        </GoogleLoginButton>
      </>
    )
  })
}
