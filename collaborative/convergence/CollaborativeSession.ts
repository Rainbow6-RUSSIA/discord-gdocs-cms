import type { DeepPartial } from "typeorm";
import { EditorManager, EditorManagerLike } from "../../modules/editor/EditorManager";
import { SheetORM } from "../sheet/orm";
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

    start = async () => {
        // this.collaborators[0] = await getGoogleProfile(this.config.token);
        await this.orm.init()
        await this.orm.selectChannel(this.config.channelId)
    }

    stop = async () => {

    }

    addMember = (profile: GoogleProfile) => {
        this.collaborators.push(profile)
    }

    removeMember = (profile: GoogleProfile) => {
        this.collaborators = this.collaborators.filter(c => c.sub !== profile.sub)
    }

    // getInitialData = async (): Promise<DeepPartial<EditorManagerLike> | null> => {
    //     // return null
    //     // TODO use real data
    //     const { webhook: url, username: defaultUsername, avatar: defaultAvatar } = (await this.orm.getChannels())[0]
    //     const { content, username, avatar, embeds, message } = (await this.orm.getPosts())[0]

    //     return EditorManager.create({
    //         messages: [{
    //             content,
    //             username: username ?? defaultUsername,
    //             avatar: avatar ?? defaultAvatar,
    //             embeds: JSON.parse(embeds),
    //         }],
    //         target: { message, url }
    //     })
    // }


}