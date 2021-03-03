import { AbstractModel, worksheet, column } from "google-spreadsheet-orm"

export const initMessageModel = (sheetId: number) => {
  @worksheet(sheetId)
  class Message extends AbstractModel {
    @column
    id!: string
    @column
    collectionId!: string
    @column
    part!: string
    @column
    name!: string
    @column
    content?: string
    @column
    username?: string
    @column
    avatar?: string
    @column
    embeds!: string
    @column
    reference?: string
  }

  return Message
}

export type MessageModel = ReturnType<typeof initMessageModel>
export type MessageInstance = InstanceType<MessageModel>
