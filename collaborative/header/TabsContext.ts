import { createContext } from "react"

export const TabsContext = createContext({
  activeTab: "preview" as "preview" | "editor",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActiveTab: (tab: "preview" | "editor") => {},
})
