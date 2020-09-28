import { createContext } from "react"
import type { HeaderManager } from "./HeaderManager"

export const HeaderManagerContext = createContext<HeaderManager | null>(null)
HeaderManagerContext.displayName = "EditorManagerContext"

export const HeaderManagerProvider = HeaderManagerContext.Provider
