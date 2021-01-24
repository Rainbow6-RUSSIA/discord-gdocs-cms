import type { DeepPartial } from "typeorm";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import { getGoogleProfile } from "../helpers/google";
import { SheetORM } from "../sheet";
import { ChannelModel } from "../sheet/channels";
import { PostModel } from "../sheet/posts";
import type { ConnectionParams, GoogleProfile } from "../types";


export class CollaborativeSession {
    constructor(config: ConnectionParams) {
        this.config = config;
        this.orm = new SheetORM(this.config)
    }

    config: ConnectionParams
    collaborators: GoogleProfile[] = [];
    orm: SheetORM
    
    get host() {
        return this.collaborators[0]
    }

    init = async () => {
        this.collaborators[0] = await getGoogleProfile(this.config.token);
        await this.orm.init()
        await this.orm.selectChannel(this.config.channelId)
    }

    // getSingleInfo = async <T extends AbstractModel> (model: new () => T, where: WhereCondition) => {
    //     return (await this.orm.getInfos<T>(model, where))[0]   
    // }

    getData = async (): Promise<DeepPartial<EditorManagerLike>> => {
        // TODO: use real data
        const { webhook, username: defaultUsername, avatar: defaultAvatar } = (await this.orm.getChannels())[0]
        const { content, username, avatar, embeds, message } = (await this.orm.getPosts())[0]

        return {
            messages: [{
                content,
                username: username ?? defaultUsername,
                avatar: avatar ?? defaultAvatar,
                embeds: JSON.parse(embeds),
            }],
            target: { message, url: webhook }
        }
    }
}