import type { DeepPartial } from "typeorm"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
import type { ChannelInstance } from "../sheet/channel"
import type { MessageInstance } from "../sheet/post"

export function convertSheetToContent(
  channel: ChannelInstance,
  messages: MessageInstance[],
): DeepPartial<EditorManagerLike> {
  const {
    webhook: url,
    username: defaultUsername,
    avatar: defaultAvatar,
  } = channel

  return {
    messages: messages.map(
      ({ content, username, avatar, embeds, reference }) => ({
        content,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        username: username || defaultUsername,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        avatar: avatar || defaultAvatar,
        embeds: JSON.parse(embeds),
        reference,
      }),
    ),
    target: { url },
  }
}

export function convertContentToSheet({
  messages,
  target,
}: EditorManagerLike): [Partial<ChannelInstance>, Partial<MessageInstance>[]] {
  const { url: webhook } = target
  return [
    { webhook },
    messages.map(({ id, embeds, ...rest }) => ({
      id: id.toString(),
      embeds: JSON.stringify(embeds),
      ...rest,
    })),
  ]
}
