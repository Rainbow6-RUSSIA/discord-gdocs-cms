import { observable } from "mobx"
import type { MessageData } from "../message/data/MessageData"
import { Message } from "../message/Message"

export class EditorManager {
  @observable message: Message

  displayName = "Discord GDocs CMS"
  displayAvatarUrl = "https://cdn.discordapp.com/avatars/758712995035217970/8bb97fa8fe04785ee714c87dde8d59db.png?size=256"

  constructor(message: MessageData) {
    this.message = Message.of(message)
  }
}
