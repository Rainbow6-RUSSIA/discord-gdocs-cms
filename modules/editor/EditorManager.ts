import { action, observable, ObservableMap } from "mobx"
import type { MessageData } from "../message/data/MessageData"
import { Message } from "../message/Message"

export class EditorManager {
  @observable index = 0
  @observable maxMessages = 5

  @action handleNext = () => {
    this.index = this.index === this.allMessages.size - 1 ? 0 : this.index + 1
  }

  @action handlePrevious = () => {
    this.index = this.index ? this.index - 1 : this.allMessages.size - 1
  }

  @action handleAdd = () => {
    const msg = Message.of({ content: "Edit me!" })
    this.allMessages.set(msg.id, msg)
    this.index = this.allMessages.size - 1

    console.log([...this.allMessages.keys()], this.message)
  }

  @action handleRemove = (i?: number) => {
    this.index = 0
    this.allMessages.delete(this.getKey(i))
    // if ((i ?? this.index) >= this.index) this.index -= 1

    console.log([...this.allMessages.keys()], this.message)
  }

  get message() {
    return Array.from(this.allMessages.values())[this.index]
  }

  set message(msg: Message) {
    this.allMessages.set(this.getKey(), msg)
  }

  getKey(i?: number) {
    return [...this.allMessages.keys()][i ?? this.index]
  }

  readonly allMessages: Map<string, Message>

  displayName = "Discord GDocs CMS"
  displayAvatarUrl =
    "https://cdn.discordapp.com/avatars/758712995035217970/8bb97fa8fe04785ee714c87dde8d59db.png?size=256"

  constructor(messages: MessageData[]) {
    this.allMessages = new Map(
      messages.map(Message.of).map(msg => [msg.id, msg]),
    )
    // observable.map(
    // )
  }
}
