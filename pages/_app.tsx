import "@reach/slider/styles.css"
import "@reach/tabs/styles.css"
import { autorun } from "mobx"
import { Observer } from "mobx-react-lite"
import App, { AppProps } from "next/app"
import React from "react"
import { QueryClientProvider, QueryClient } from "react-query"
import { ThemeProvider } from "styled-components"
import { CollaborationManager } from "../collaborative/manager/CollaborationManager"
import { CollaborationManagerProvider } from "../collaborative/manager/CollaborationManagerContext"
import { ModalManager } from "../common/modal/ModalManager"
import { ModalManagerProvider } from "../common/modal/ModalManagerContext"
import { ModalOverlay } from "../common/modal/ModalOverlay"
import { ErrorBoundary } from "../common/page/ErrorBoundary"
import { PopoverManager } from "../common/popover/PopoverManager"
import { PopoverManagerProvider } from "../common/popover/PopoverManagerContext"
import { PopoverOverlay } from "../common/popover/PopoverOverlay"
import { PreferenceManager } from "../common/settings/PreferenceManager"
import { PreferenceManagerProvider } from "../common/settings/PreferenceManagerContext"
import { resetNextId } from "../common/state/uid"
import { GlobalStyle } from "../common/theming/GlobalStyle"
import { TooltipManager } from "../common/tooltip/TooltipManager"
import { TooltipManagerProvider } from "../common/tooltip/TooltipManagerContext"
import { TooltipOverlay } from "../common/tooltip/TooltipOverlay"

export default class Application extends App {
  private readonly preferenceManager = new PreferenceManager()
  private readonly modalManager = new ModalManager()
  private readonly popoverManager = new PopoverManager()
  private readonly tooltipManager = new TooltipManager()
  private readonly collaborationManager = new CollaborationManager()
  private readonly queryClient = new QueryClient()

  private readonly disposers: (() => void)[] = []

  constructor(props: Readonly<AppProps>) {
    super(props)

    if (typeof window === "undefined") {
      resetNextId()
    }
  }

  componentDidMount() {
    this.preferenceManager.load()
    // this.collaborationManager.load()

    this.disposers.push(
      autorun(() => this.preferenceManager.dump(), {
        delay: 500,
      }),
    )
  }

  componentWillUnmount() {
    for (const disposer of this.disposers) {
      disposer()
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Observer>
        {() => (
          <ThemeProvider theme={this.preferenceManager.theme}>
            <GlobalStyle />
            <ErrorBoundary>
              <PreferenceManagerProvider value={this.preferenceManager}>
                <CollaborationManagerProvider value={this.collaborationManager}>
                  <QueryClientProvider client={this.queryClient}>
                    <ModalManagerProvider value={this.modalManager}>
                      <PopoverManagerProvider value={this.popoverManager}>
                        <TooltipManagerProvider value={this.tooltipManager}>
                          <Component {...pageProps} />
                          <ModalOverlay />
                          <PopoverOverlay />
                          <TooltipOverlay />
                        </TooltipManagerProvider>
                      </PopoverManagerProvider>
                    </ModalManagerProvider>
                  </QueryClientProvider>
                </CollaborationManagerProvider>
              </PreferenceManagerProvider>
            </ErrorBoundary>
          </ThemeProvider>
        )}
      </Observer>
    )
  }
}
