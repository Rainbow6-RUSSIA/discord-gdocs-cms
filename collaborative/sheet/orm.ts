import ORM from "google-sheets-orm";
import type { GoogleSpreadsheet } from "google-spreadsheet";
import SheetConnection, { Config } from "google-spreadsheet-orm";
import type { DeepPartial } from "typeorm";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import { convertContentToSheet, convertSheetToContent } from "../helpers/convert";
import { getAuthClient, getDocument } from "../helpers/google";
import type { ConnectionParams } from "../types";
import { ChannelModel, initChannelModel } from "./channel";
import { initPostModel, PostInstance, PostModel } from "./post";

export type SheetOrmConfig = {
    token: string;
    spreadsheetId: string;
    validate?: boolean
    channelId?: string;
    channelSheetId?: number
    postId?: string;
    postSheetId?: number
}

export class SheetORM extends ORM {
    constructor(config: SheetOrmConfig) {
        super({})
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

        if (this.config.channelId) {
            await this.selectChannel(this.config.channelId)
        }
    }

    getSheetIdByTitle = (title: string) => {
        if (this.document) {
            return Number.parseInt(this.document.sheetsByTitle[title].sheetId, 10) 
        } 

        throw new Error("No document fetched")
    }

    getChannels = async () => {
        if (this.ChannelClass) return this.connection.getInfos(this.ChannelClass, { id: Boolean })
        throw new Error("No Channel Model initialized")
    }

    getPosts = async () => {
        if (this.PostClass) return this.connection.getInfos(this.PostClass, { id: Boolean })
        throw new Error("No Post Model initialized")
    } 

    selectChannel = async (id: string) => {
        if (!this.config.postSheetId) {
            if (!this.ChannelClass) throw new Error("No Channel Model initialized")
            const channels = await this.connection.getInfos(this.ChannelClass, { id })
            this.config.postSheetId = this.getSheetIdByTitle(`#${channels[0].name}`)
        }

        this.PostClass = initPostModel(this.config.postSheetId)
        
        if (this.config.validate) {
            await this.connection.validateModel(this.PostClass)
            console.log("Model is ok, posts sheet id", this.config.postSheetId)
        }
    }

    saveContent = async (content: EditorManagerLike) => {
        if (!this.PostClass) throw new Error("No Post Model initialized")
        const instance = new this.PostClass()
        const [channelData, postData] = convertContentToSheet(content)
        Object.assign(instance, postData)
        console.log(instance)
        await this.connection.setInfo(instance)
    }

    config: SheetOrmConfig
    private document?: GoogleSpreadsheet
    ChannelClass?: ChannelModel
    PostClass?: PostModel
    
}