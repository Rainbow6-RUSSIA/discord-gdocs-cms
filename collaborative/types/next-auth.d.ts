import { Session } from "next-auth";
import { CustomUser } from "."

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
     */
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface Session {
        id: string
        accessToken: string
        expires: string
        accounts: CustomUser[]
    }
}