import { createContext } from "react"
import type { CursorsMap } from "./cursor"

export const CursorsContext = createContext<CursorsMap | null>(null)
CursorsContext.displayName = "CursorContext"

export const CursorsContextProvider = CursorsContext.Provider
