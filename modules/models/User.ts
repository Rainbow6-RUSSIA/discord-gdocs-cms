import Adapters, { TypeORMUserModel } from "next-auth/adapters"

// Extend the built-in models using class inheritance
export class User { // TypeORM.Models.User.model
  // You can extend the options in a model but you should not remove the base
  // properties or change the order of the built-in options on the constructor

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
}

export const UserSchema = {
  name: "User",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
}