/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  connectWithJwt,
  RealTimeModel,
  ConvergenceDomain,
  RealTimeArray,
  RealTimeObject,
} from "@convergence/convergence"
import isEqual from "lodash/isEqual"
import { autorun, observe, reaction, toJS } from "mobx"
import {
  applySnapshot,
  getSnapshot,
  IDisposer,
  IJsonPatch,
  onPatch,
} from "mobx-state-tree"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
import { convertSheetToContent } from "../helpers/convert"
import { parseNumbers } from "../helpers/parseNumbers"
import type { CollaborationManager } from "../manager/CollaborationManager"
import { CollaborationManagerMode } from "../types"
import { ConvergenceCursor } from "./cursor"

export class ConvergenceClient {
  constructor(collaboration: CollaborationManager) {
    if (!collaboration.editor) throw new Error("No Editor")
    this.collaboration = collaboration
    this.editor = collaboration.editor
    void this.init()
    this.collaboration.setMode(CollaborationManagerMode.CONNECTING)
  }

  editor: EditorManagerLike
  collaboration: CollaborationManager
  domain?: ConvergenceDomain
  model?: RealTimeModel
  lock = true

  disposers: IDisposer[] = []

  cursor?: ConvergenceCursor

  init = async () => {
    const collaborationServerURL = process.env.NEXT_PUBLIC_CONVERGENCE_URL
    if (collaborationServerURL) {
      const jwt = await fetch("/api/collaboration/token").then(async d =>
        d.text(),
      )
      console.log("JWT", jwt)
      this.domain = await connectWithJwt(collaborationServerURL, jwt)
      this.disposers.push(
        reaction(
          () => this.collaboration.post,
          async () => this.reconnect(),
        ),
      )
      // this.disposers.push(
      //     observe(this.collaboration, "post", this.reconnect),
      // )

      // await this.connect()
    } else {
      this.collaboration.resetMode(CollaborationManagerMode.CONNECTING)
      this.collaboration.showError(new Error("No Collaboration server URL set"))
      console.warn("No Collaboration server URL set")
    }
  }

  reconnect = async () => {
    await this.disconnect()
    await this.connect()
  }

  dispose = () => {
    void this.disconnect()
    this.domain?.dispose()
    for (const dispose of this.disposers) dispose()
  }

  connect = async () => {
    const googleUser = this.collaboration.session?.google
    const spreadsheetId = this.collaboration.spreadsheet?.id
    const channel = this.collaboration.channel
    const post = this.collaboration.post
    if (this.domain && googleUser && spreadsheetId && channel && post) {
      this.model = await this.domain.models().openAutoCreate({
        collection: spreadsheetId,
        id: `${channel.id}/${post.id}`,
        data: convertSheetToContent(channel, post),
        ephemeral: true,
      })
      this.syncUpdate() // get content
      this.model.root().value(getSnapshot(this.editor)) // force set content with ids to fix incomplete model
      // this.domain.presence().on(PresenceService.Events.AVAILABILITY_CHANGED)
      this.model.on(RealTimeModel.Events.VERSION_CHANGED, this.syncUpdate)
      this.disposers.push(onPatch(this.editor, this.handlePatch))
      this.cursor = new ConvergenceCursor(this)
      this.cursor.initTracking()

      this.collaboration.setMode(CollaborationManagerMode.ONLINE)
    } else {
      this.collaboration.showError(
        new Error("Cannot connect to collaboration server"),
      )
      console.warn(
        "Cannot connect to collaboration server",
        toJS(googleUser),
        spreadsheetId,
        channel?.id,
        post?.id,
      )
    }

    this.collaboration.resetMode(CollaborationManagerMode.CONNECTING)
  }

  disconnect = async () => {
    this.collaboration.resetMode(CollaborationManagerMode.ONLINE)
    this.cursor?.stopTracking()
    if (this.isConnected) await this.model!.close()
  }

  get isConnected(): boolean {
    return Boolean(this.model?.isOpen())
  }

  handlePatch = (patch: IJsonPatch) => {
    if (!this.isConnected || this.lock) return
    const root = this.model!.root()
    const path = patch.path.split("/").filter(Boolean).map(parseNumbers)
    const element = root.elementAt(...path)
    console.log("PATCH", patch)
    switch (patch.op) {
      case "add": {
        const newKey = path.pop()
        const parent = root.elementAt(...path)
        if (typeof newKey === "number" && parent instanceof RealTimeArray)
          parent.insert(newKey, patch.value)
        if (typeof newKey === "string" && parent instanceof RealTimeObject)
          parent.set(newKey, patch.value)
        break
      }
      case "remove":
        element.removeFromParent()
        break
      case "replace":
        element.value(patch.value)
        break
    }
  }

  syncUpdate = () => {
    if (!this.isConnected) return

    const model = this.model!

    if (isEqual(model.root().value(), getSnapshot(this.editor))) return

    this.lock = true

    const value = model.root().value()
    const isWebhookChanged = this.editor.target.url !== value.target?.url
    applySnapshot(this.editor, value)
    if (isWebhookChanged) {
      void this.editor.process("/target/url")
    }

    console.log("received change version", model.version())

    this.cursor?.revertCaretPosition()
    this.lock = false
  }
}
