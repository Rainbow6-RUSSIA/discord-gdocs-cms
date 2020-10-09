import { randomBytes } from "crypto"

export class Session {
  constructor (userId: string, expires: Date, sessionToken: string, accessToken: string) {
    this.userId = userId
    this.expires = expires
    this.sessionToken = sessionToken || randomBytes(32).toString("hex")
    this.accessToken = accessToken || randomBytes(32).toString("hex")
  }

  userId: string;
  expires: Date;
  sessionToken: string;
  accessToken: string;
}

export const SessionSchema = {
  name: "Session",
  target: Session,
  columns: {
    id: {
      // This property has `objectId: true` instead of `type: int` in MongoDB
      primary: true,
      type: "uuid",
      generated: true
    },
    userId: {
      // This property is set to `type: objectId` on MongoDB databases
      type: "uuid"
    },
    expires: {
      // The date the session expires (is updated when a session is active)
      type: "timestamp"
    },
    sessionToken: {
      // The sessionToken should never be exposed to client side JavaScript
      type: "varchar",
      unique: true
    },
    accessToken: {
      // The accessToken can be safely exposed to client side JavaScript to
      // to identify the owner of a session without exposing the sessionToken
      type: "varchar",
      unique: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  }
}
