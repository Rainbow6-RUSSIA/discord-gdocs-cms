import type { GoogleSpreadsheet } from "google-spreadsheet";
import SheetConnection, { Config } from "google-spreadsheet-orm";
import { getAuthClient, getDocument } from "../helpers/google";
import type { ConnectionParams } from "../types";
import { ChannelModel, initChannelModel } from "./channels";
import { initPostModel, PostModel } from "./posts";

export type SheetOrmConfig = {
    token: string;
    spreadsheetId: string;
    validate?: boolean
    channelId?: string;
    channelSheetId?: number
    postId?: string;
    postSheetId?: number
}

export class SheetORM {
    constructor(config: SheetOrmConfig) {
        global.models = []
        this.config = { validate: true, ...config };
    }

    init = async () => {
        if (!this.config.channelSheetId || !this.config.postSheetId) {
            this.document = await getDocument(this.config.token, this.config.spreadsheetId)
        }

        const config = { 
            spreadsheetId: this.config.spreadsheetId,
            authClient: getAuthClient(this.config.token),
            disableSingleton: true,
            migrate: "safe",
            logger: console
        } as unknown as Config
        this.connection = await SheetConnection.connect(config);

        if (!this.config.channelSheetId) {
            this.config.channelSheetId = this.getSheetIdByTitle("channels")
        }

        this.ChannelClass = initChannelModel(this.config.channelSheetId)
        
        if (this.config.validate) {
            await this.connection.validateModel(this.ChannelClass)
            console.log("Model is ok, channels sheet id", this.config.channelSheetId)
        }
    }

    getSheetIdByTitle = (title: string) => {
        if (this.document) {
            return Number.parseInt(this.document.sheetsByTitle[title].sheetId, 10) 
        } 

        throw new Error("No document fetched")
    }

    getChannels = async () => this.ChannelClass ? this.connection.getInfos(this.ChannelClass, { id: Boolean }) : []

    selectChannel = async (id: string) => {
        if (!this.ChannelClass) return
        const channels = await this.connection.getInfos(this.ChannelClass, { id })

        if (!this.config.postSheetId) {
            this.config.postSheetId = this.getSheetIdByTitle(`#${channels[0].name}`)
        }

        this.PostClass = initPostModel(this.config.postSheetId)
        
        if (this.config.validate) {
            await this.connection.validateModel(this.PostClass)
            console.log("Model is ok, posts sheet id", this.config.postSheetId)
        }
    }

    getPosts = async () => this.PostClass ? this.connection.getInfos(this.PostClass, { id: Boolean }) : []

    config: SheetOrmConfig
    connection!: SheetConnection
    document?: GoogleSpreadsheet
    ChannelClass?: ChannelModel
    PostClass?: PostModel
    
}