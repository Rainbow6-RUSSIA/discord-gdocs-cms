import { AbstractModel, worksheet, column } from "google-spreadsheet-orm";

export const initPostModel = (sheetId: number) => {
    @worksheet(sheetId)
    class Post extends AbstractModel {
        @column
        id!: number;
        @column
        collectionId!: number;
        @column
        part!: number;
        @column
        name!: string;
        @column
        content?: string;
        @column
        username?: string;
        @column
        avatar?: string;
        @column
        embeds!: string;
        @column
        message?: string;
    }

    return Post
}

export type PostModel = ReturnType<typeof initPostModel>
export type PostInstance = InstanceType<PostModel>