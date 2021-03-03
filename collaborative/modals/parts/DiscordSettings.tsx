import { useObserver } from "mobx-react-lite"
import { signIn } from "next-auth/client"
import React from "react"
import { useRequiredContext } from "../../../common/state/useRequiredContext"
import { CollaborationManagerContext } from "../../manager/CollaborationManagerContext"
import { DiscordLoginButton } from "./Layout"

export function DiscordSettings() {
  const collaborationManager = useRequiredContext(CollaborationManagerContext)

  return useObserver(() => {
    const discord = collaborationManager.discord
    return discord ? (
      <>Discord settings here</>
    ) : (
      <>
        To use collaboration features you must login into a Discord account and
        add QuarrelPost bot.
        <DiscordLoginButton
          onClick={async () => collaborationManager.link("discord")}
        >
          <img src="/static/google-button.svg" height={32} width={32} />
          <span>Sign in with Discord</span>
        </DiscordLoginButton>
      </>
    )
  })
}
