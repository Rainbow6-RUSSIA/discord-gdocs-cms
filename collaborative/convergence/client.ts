import { connectAnonymously, ConvergenceDomain, PresenceService, RealTimeModel, RealTimeObject } from "@convergence/convergence";
import { createHash } from "crypto";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { applySnapshot, getSnapshot, IDisposer, onSnapshot } from "mobx-state-tree";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import type { CollaborationManager } from "../manager/CollaborationManager";
import { ConvergenceCursor } from "./cursor";

export class ConvergenceClient {    
    constructor(collaborationManager: CollaborationManager, editorStore: EditorManagerLike){
      this.collaborationManager = collaborationManager;
      this.editorStore = editorStore;
    }
  
    editorStore: EditorManagerLike
    collaborationManager: CollaborationManager
    domain?: ConvergenceDomain
    model?: RealTimeModel
  
    disposers: IDisposer[] = [];

    cursor?: ConvergenceCursor;

    init = async () => {
        this.domain = await connectAnonymously(process.env.NEXT_PUBLIC_CONVERGENCE_URL!)
        const modelService = this.domain.models();
        this.model = await modelService.openAutoCreate({
          collection: "example",
          id: "getting-started",
          data: getSnapshot(this.editorStore)
        })
        this.syncUpdate()
        // this.domain.presence().on(PresenceService.Events.AVAILABILITY_CHANGED)
        this.model.on(RealTimeModel.Events.VERSION_CHANGED, this.syncUpdate)
        this.disposers.push(onSnapshot(this.editorStore, debounce(this.handleSnapshot, 500, {maxWait: 1000} )))
        this.cursor = new ConvergenceCursor()
        this.cursor.initTracking()
    }
    
    bind = () => {
    //   this.disposers.push(
    //     observe(this.collaborationManager, "session", this.connect)
    //   )
    //   this.disposers.push(
    //     observe(this.collaborationManager, "post", this.connect)
    //   )
    }
  
    dispose = () => {
        this.domain?.dispose()
        this.cursor?.stopTracking()
        for (const dispose of this.disposers) { dispose() }
    }
  
    connect = () => {
    //   const token = this.collaborationManager.session?.google?.accessToken; 
    //   const spreadsheetId = this.collaborationManager.spreadsheet?.id;
    //   const channelId = this.collaborationManager.channel?.id;
    //   const postId = this.collaborationManager.post?.id.toString();
    //   const wss = process.env.NEXT_PUBLIC_COLLABORATIVE_WSS
    //   console.log("EMAIL", this.collaborationManager.session?.google?.email, "DOC", spreadsheetId)
    //   if (token && spreadsheetId && channelId && postId && wss) {
    //     this.disconnect()
    //     console.log("Connecting to WSS:", wss)
    //   } else {
    //     console.warn("Cannot connect to WSS", token, spreadsheetId, channelId, postId, wss)
    //     return
    //   }
    //   this.socket = new ReconnectingWebSocket(wss, [token, spreadsheetId, channelId, postId]) as WebSocket
    
    //   this.disposers.push(onSnapshot(this.editorStore, debounce(this.handleSnapshot, 500, {maxWait: 1000} )))

    }
  
    handleSnapshot = (newData: EditorManagerLike) => {
        if (!this.model) return
        const root = this.model.root();
        if (isEqual(root.value(), newData)) return
        console.log("NEW DATA", root.value(), newData)
        root.value(newData)
    }
  
    syncUpdate = () => {
        if (!this.model) return
        const root = this.model.root();
        applySnapshot(this.editorStore, root.value())
  
    //   const isWebhookChanged = this.editorStore.target.url !== this.doc.data?.target?.url
  
    //   applySnapshot(this.editorStore, this.doc.data)
    //   if (isWebhookChanged) {
    //     void this.editorStore.process("/target/url");
    //   }
  
        console.log("received change", createHash("md5").update(JSON.stringify(root.value())).digest("base64"), "version", this.model.version())

        this.cursor?.revertCaretPosition()

    }

    // isChanged = () => !isEqual(getSnapshot(this.editorStore), this.model?.root().value())
  }