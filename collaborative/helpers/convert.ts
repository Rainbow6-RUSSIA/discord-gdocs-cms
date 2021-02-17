import type { DeepPartial } from "typeorm"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
import type { ChannelInstance } from "../sheet/channel"
import type { PostInstance } from "../sheet/post"

export function convertSheetToContent(
    channel: ChannelInstance,
    post: PostInstance,
): DeepPartial<EditorManagerLike> {
    const {
        webhook: url,
        username: defaultUsername,
        avatar: defaultAvatar,
    } = channel
    const { content, username, avatar, embeds, message } = post

    return {
        messages: [
            {
                content,
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                username: username || defaultUsername,
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                avatar: avatar || defaultAvatar,
                embeds: JSON.parse(embeds),
            },
        ],
        target: { message, url },
    }
}

export function convertContentToSheet({
    messages,
    target,
}: EditorManagerLike): [Partial<ChannelInstance>, Partial<PostInstance>] {
    const { url: webhook, message } = target
    const { content, username, avatar, embeds } = messages[0]
    return [
        { webhook },
        { content, username, avatar, embeds: JSON.stringify(embeds), message },
    ]
}
