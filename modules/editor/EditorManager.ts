import { action, observable, ObservableMap } from "mobx"
import type { MessageData } from "../message/data/MessageData"
import { Message } from "../message/Message"

export class EditorManager {
  @observable index = 0

  @action handleNext = () => {
    this.index = this.index === this.allMessages.size - 1 ? 0 : this.index + 1
  }

  @action handlePrevious = () => {
    this.index = this.index ? this.index - 1 : this.allMessages.size - 1
  }

  get message() {
    return Array.from(this.allMessages.values())[this.index]
  }

  set message(msg: Message) {
    const key = [...this.allMessages.keys()][this.index]
    this.allMessages.set(key, msg)
  }

  readonly allMessages: ObservableMap<string, Message>

  displayName = "Discord GDocs CMS"
  displayAvatarUrl =
    "https://cdn.discordapp.com/avatars/758712995035217970/8bb97fa8fe04785ee714c87dde8d59db.png?size=256"

  constructor(messages: MessageData[]) {
    this.allMessages = observable.map(
      new Map(messages.map((m, i) => [m.id ?? i.toString(), Message.of(m)])),
    )
  }
}
