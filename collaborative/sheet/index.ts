import type { GoogleSpreadsheet } from "google-spreadsheet";
import SheetConnection, { Config } from "google-spreadsheet-orm";
import { getAuthClient, getDocument } from "../helpers/google";
import type { ConnectionParams } from "../types";
import { ChannelModel, initChannelModel } from "./channels";
import { initPostModel, PostModel } from "./posts";

export class SheetORM {
    constructor(config: ConnectionParams) {
        this.config = config;
    }

    init = async () => {
        this.document = await getDocument(this.config.token, this.config.spreadsheetId)

        const config = { 
            spreadsheetId: this.config.spreadsheetId,
            authClient: getAuthClient(this.config.token),
            disableSingleton: true,
            migrate: "safe",
            logger: console
        } as unknown as Config
        this.connection = await SheetConnection.connect(config);

        const channelSheetId = this.getSheetIdByTitle("channels")
        this.ChannelClass = initChannelModel(channelSheetId)
        await this.connection.validateModel(this.ChannelClass)
        console.log("Model is ok, channels sheet id", channelSheetId)
    }

    getSheetIdByTitle = (title: string) => Number.parseInt(this.document.sheetsByTitle[title].sheetId, 10)

    getChannels = async () => this.ChannelClass ? this.connection.getInfos(this.ChannelClass) : []

    selectChannel = async (id: string) => {
        if (!this.ChannelClass) return
        const channels = await this.connection.getInfos(this.ChannelClass, { id })

        const postSheetId = this.document.sheetsByTitle[`#${channels[0].name}`].sheetId
        this.PostClass = initPostModel(Number.parseInt(postSheetId, 10))
        await this.connection.validateModel(this.PostClass)
        console.log("Model is ok, posts sheet id", postSheetId)
    }

    getPosts = async () => this.PostClass ? this.connection.getInfos(this.PostClass) : []

    config: ConnectionParams
    connection!: SheetConnection
    document!: GoogleSpreadsheet
    ChannelClass?: ChannelModel
    PostClass?: PostModel
    
}