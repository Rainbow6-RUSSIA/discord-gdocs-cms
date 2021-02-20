import { AbstractModel, worksheet, column } from "google-spreadsheet-orm"

export const initChannelModel = (sheetId: number) => {
  @worksheet(sheetId)
  class Channel extends AbstractModel {
    @column
    id!: string
    @column
    name!: string
    @column
    webhook!: string
    @column
    username!: string
    @column
    avatar!: string
  }

  return Channel
}

export type ChannelModel = ReturnType<typeof initChannelModel>
export type ChannelInstance = InstanceType<ChannelModel>
