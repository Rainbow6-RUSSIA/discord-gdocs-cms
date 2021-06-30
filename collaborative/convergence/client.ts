/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  connectWithJwt,
  RealTimeModel,
  ConvergenceDomain,
  RealTimeArray,
  RealTimeObject,
  DomainUser
} from "@convergence/convergence"
import isEqual from "lodash/isEqual"
import {
  applySnapshot,
  getSnapshot,
  IDisposer,
  IJsonPatch,
  onPatch,
} from "mobx-state-tree"
import { getSession } from "next-auth/client"
import type { EditorManagerLike } from "../../modules/editor/EditorManager"
// import { convertSheetToContent } from "../helpers/convert"
import { parseNumbers } from "../helpers/parseNumbers"
import type { CollaborationManager } from "../manager/CollaborationManager"
import { ConvergenceCursor } from "./cursor"

export class ConvergenceClient {
  static async init(collaboration: CollaborationManager) {
    if (!collaboration.editor) throw new Error("No Editor")

    const instance = new ConvergenceClient()

    instance.collaboration = collaboration
    instance.editor = collaboration.editor

    const collaborationServerURL = process.env.NEXT_PUBLIC_CONVERGENCE_URL
    if (collaborationServerURL) {
      const jwt = await fetch("/api/collaboration/token").then(async d => d.text())
      console.log("JWT", jwt)
      instance.domain = await connectWithJwt(collaborationServerURL, jwt)
      // TODO:
      // this.disposers.push(
      //   reaction(
      //     () => this.collaboration.post,
      //     async () => this.reconnect(),
      //   ),
      // )
      // this.disposers.push(
      //     observe(this.collaboration, "post", this.reconnect),
      // )

      // await this.connect()
    } else {
      // this.collaboration.resetMode(CollaborationManagerMode.CONNECTING)
      collaboration.showError(new Error("No Collaboration server URL set"))
      console.warn("No Collaboration server URL set")
    }

    return instance
  }

  editor!: EditorManagerLike
  collaboration!: CollaborationManager
  domain: ConvergenceDomain | null = null
  model: RealTimeModel | null = null
  user: DomainUser | null = null
  lock = true

  disposers: IDisposer[] = []

  cursor?: ConvergenceCursor

  reconnect = async () => {
    await this.disconnect()
    await this.connect()
  }

  dispose = () => {
    void this.disconnect()
    this.domain?.dispose()
    for (const dispose of this.disposers) dispose()
  }

  connect = async (modelId?: string) => {
    // TODO:
    // const googleUser = this.collaboration.google
    // const spreadsheetId = this.collaboration.spreadsheet?.id
    // const channel = this.collaboration.channel
    // const post = this.collaboration.post
    const session = await getSession()

    if (this.domain && session) {
      const editorData = getSnapshot(this.editor)
      console.log("Fresh connect:", modelId)

      if (modelId) {
        this.model = await this.domain.models().open(modelId)
      } else {
        this.model = await this.domain.models().openAutoCreate({
          collection: "temp",
          // id: `${channel.id}/${post.id}`,
          data: editorData,// convertSheetToContent(channel, post),
          ephemeral: true,
          userPermissions: {
            [session.id]: {
              read: true,
              write: true,
              manage: true,
              remove: true
            }
          }

        })
      }

      this.user = await this.domain.identity().user(session.id)
      console.log("Convergence User:", this.user)

      console.log(`Connected to Collaboration server with modelId: ${this.model.modelId()}`)
      this.syncUpdate() // get content
      // this.model.root().value(getSnapshot(this.editor)) // force set content with ids to fix incomplete model from spreadsheet
      // this.domain.presence().on(PresenceService.Events.AVAILABILITY_CHANGED)
      this.model.on(RealTimeModel.Events.VERSION_CHANGED, this.syncUpdate)
      this.disposers.push(onPatch(this.editor, this.handlePatch))
      this.cursor = new ConvergenceCursor(this)
      this.cursor.initTracking()

      this.lock = false

      // this.collaboration.setMode(CollaborationManagerMode.ONLINE)
    } else {
      this.collaboration.showError(
        new Error("Cannot connect to collaboration server"),
      )
      console.warn(
        "Cannot connect to collaboration server",
        session
      )
    }

    // this.collaboration.resetMode(CollaborationManagerMode.CONNECTING)
  }

  disconnect = async () => {
    // this.collaboration.resetMode(CollaborationManagerMode.ONLINE)
    this.cursor?.stopTracking()
    if (this.isConnected) await this.model!.close()
  }

  get isConnected(): boolean {
    return Boolean(this.model?.isOpen())
  }

  handlePatch = (patch: IJsonPatch) => {
    console.log("🚀 ~ file: client.ts ~ line 157 ~ ConvergenceClient ~ this.isConnected, this.lock", this.isConnected, this.lock)
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
    console.log("🚀 ~ file: client.ts ~ line 176 ~ ConvergenceClient ~ this.isConnected", this.isConnected)
    if (!this.isConnected) return

    const model = this.model!

    if (isEqual(model.root().value(), getSnapshot(this.editor))) return

    this.lock = true

    const value = model.root().value()
    const isWebhooksChanged = !isEqual(this.editor.targets, value.targets)
    applySnapshot(this.editor, value)
    if (isWebhooksChanged) {
      for (let i = 0; i < this.editor.targets.length; i++) {
        void this.editor.process(`/targets/${i}/url`)
      }
    }

    console.log("received change version", model.version())

    this.cursor?.revertCaretPosition()
    this.lock = false
  }
}
