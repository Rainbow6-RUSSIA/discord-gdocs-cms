import { getSession, useSession } from "next-auth/client"
import type { CustomSession } from "../types"

export const getCustomSession = (getSession as unknown) as (
    ...args: Parameters<typeof getSession>
  ) => Promise<CustomSession | null | undefined>
  
  export const useCustomSession = useSession as unknown as () => [CustomSession | null | undefined, boolean]