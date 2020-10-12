import { createContext } from "react"
import type { ExternalServiceManager } from "./ExternalServiceManager"

export const ExternalServiceManagerContext = createContext<ExternalServiceManager | null>(
  null,
)
ExternalServiceManagerContext.displayName = "ExternalServiceManagerContext"

export const ExternalServiceManagerProvider =
  ExternalServiceManagerContext.Provider
