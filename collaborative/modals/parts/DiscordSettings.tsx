import { useObserver } from "mobx-react-lite"
import React from "react"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { DiscordLoginButton, LoginContainer, LoginInfo } from "./Layout"

export function DiscordSettings() {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  return useObserver(() => {
    const discord = collaborationManager.discord
    return discord ? (
      <>Discord settings here</>
    ) : (
      <LoginContainer>
        <LoginInfo>QuarrelPost bot provides an ability to restore messages previously sent by webhooks. (Soon™)</LoginInfo>
        <DiscordLoginButton
          onClick={async () => collaborationManager.link("discord")}
        >
          <img src="/static/discord-button.svg" height={32} width={32} />
          <span>Sign in with Discord</span>
        </DiscordLoginButton>
      </LoginContainer>
    )
  })
}
