import { createContext } from "react"
import type { CollaborationManager } from "./CollaborationManager"

export const CollaborationManagerContext = createContext<CollaborationManager | null>(
  null,
)
CollaborationManagerContext.displayName = "CollaborationManagerContext"

export const CollaborationManagerProvider =
  CollaborationManagerContext.Provider
