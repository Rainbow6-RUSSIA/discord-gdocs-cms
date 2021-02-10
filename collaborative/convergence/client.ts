/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  connectWithJwt,
  RealTimeModel,
  ConvergenceDomain,
} from "@convergence/convergence"
import { createHash } from "crypto"
import debounce from "lodash.debounce"
import isEqual from "lodash.isequal"
import { observe, toJS } from "mobx"
import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree"
import type { DeepPartial } from "typeorm"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
import type { CollaborationManager } from "../manager/CollaborationManager"
import type { ChannelInstance } from "../sheet/channel"
import type { PostInstance } from "../sheet/post"
import { ConvergenceCursor } from "./cursor"

export class ConvergenceClient {
  constructor(
    collaborationManager: CollaborationManager,
    editorStore: EditorManagerLike,
  ) {
    this.collaborationManager = collaborationManager
    this.editorStore = editorStore
    Object.assign(process.browser ? window : {}, { connect: this.connect })
  }

  static getInitialData = (
    channel: ChannelInstance,
    post: PostInstance,
  ): DeepPartial<EditorManagerLike> => {
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
          username: username ?? defaultUsername,
          avatar: avatar ?? defaultAvatar,
          embeds: JSON.parse(embeds),
        },
      ],
      target: { message, url },
    }
  }

  editorStore: EditorManagerLike
  collaborationManager: CollaborationManager
  domain?: ConvergenceDomain
  model?: RealTimeModel

  disposers: IDisposer[] = []

  cursor?: ConvergenceCursor

  init = () => {
    this.disposers.push(
      observe(this.collaborationManager, "session", this.connect),
      observe(this.collaborationManager, "post", this.connect),
    )
  }

  dispose = () => {
    this.domain?.dispose()
    this.cursor?.stopTracking()
    for (const dispose of this.disposers) {
      dispose()
    }
  }

  connect = async () => {
    const collaborationServerURL = process.env.NEXT_PUBLIC_CONVERGENCE_URL
    const googleUser = this.collaborationManager.session?.google
    const spreadsheetId = this.collaborationManager.spreadsheet?.id
    const channel = this.collaborationManager.channel
    const post = this.collaborationManager.post
    if (
      collaborationServerURL &&
      googleUser &&
      spreadsheetId &&
      channel &&
      post
    ) {
      const jwt = await fetch("/api/collaboration/token").then(async d =>
        d.text(),
      )
      console.log("JWT", jwt)
      this.domain = await connectWithJwt(collaborationServerURL, jwt)
      const modelService = this.domain.models()
      this.model = await modelService.openAutoCreate({
        collection: spreadsheetId,
        id: `${channel.id}/${post.id}`,
        data: ConvergenceClient.getInitialData(channel, post),
        ephemeral: true
      })
      this.syncUpdate()
      // this.domain.presence().on(PresenceService.Events.AVAILABILITY_CHANGED)
      this.model.on(RealTimeModel.Events.VERSION_CHANGED, this.syncUpdate)
      this.disposers.push(
        onSnapshot(
          this.editorStore,
          debounce(this.handleSnapshot, 500, { maxWait: 1000 }),
        ),
      )
      this.cursor = new ConvergenceCursor(this)
      this.cursor.initTracking()
    } else {
      console.warn(
        "Cannot connect to collaboration server",
        collaborationServerURL,
        toJS(googleUser),
        spreadsheetId,
        channel,
        post,
      )
    }
  }

  handleSnapshot = (newData: EditorManagerLike) => {
    if (!this.model) return
    const root = this.model.root()
    if (isEqual(root.value(), newData)) return
    console.log("NEW DATA", newData)
    root.value(newData)
  }

  syncUpdate = () => {
    if (!this.model) return
    const value = this.model.root().value()

    const isWebhookChanged = this.editorStore.target.url !== value.target?.url

    applySnapshot(this.editorStore, value)

    if (isWebhookChanged) {
      void this.editorStore.process("/target/url")
    }

    console.log(
      "received change",
      createHash("md5").update(JSON.stringify(value)).digest("base64"),
      "version",
      this.model.version(),
    )

    this.cursor?.revertCaretPosition()
  }
}
