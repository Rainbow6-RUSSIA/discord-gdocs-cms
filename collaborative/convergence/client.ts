import { Convergence, ConvergenceDomain } from "@convergence/convergence"
import { createHash } from "crypto";
import { isEqual } from "date-fns";
import debounce from "lodash.debounce";
import { observe } from "mobx";
import { IDisposer, onSnapshot, applySnapshot, getSnapshot } from "mobx-state-tree";
import ReconnectingWebSocket from "reconnecting-websocket";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import type { CollaborationManager } from "../manager/CollaborationManager";

export class ConvergenceClient {
    constructor(collaborationManager: CollaborationManager, editorStore: EditorManagerLike){
      this.collaborationManager = collaborationManager;
      this.editorStore = editorStore;
    }
  
    socket?: WebSocket;
    editorStore: EditorManagerLike
    collaborationManager: CollaborationManager
    m
  
    disposers: IDisposer[] = [];

    init = async () => {
        const domain = await Convergence.connectAnonymously(process.env.NEXT_PUBLIC_COLLABORATIVE_WSS!)
        const modelService = domain.models();
        const model = await modelService.openAutoCreate({
          collection: "example",
          id: "getting-started",
          data: { text: "Hello World" }
        })
        model.on("version_changed", this.syncUpdate)
    }
    
    bind = () => {
      this.disposers.push(
        observe(this.collaborationManager, "session", this.connect)
      )
      this.disposers.push(
        observe(this.collaborationManager, "post", this.connect)
      )
    }
  
    dispose = () => {
      this.disconnect()
      for (const dispose of this.disposers) { dispose() }
    }
  
    connect = () => {
      const token = this.collaborationManager.session?.google?.accessToken; 
      const spreadsheetId = this.collaborationManager.spreadsheet?.id;
      const channelId = this.collaborationManager.channel?.id;
      const postId = this.collaborationManager.post?.id.toString();
      const wss = process.env.NEXT_PUBLIC_COLLABORATIVE_WSS
      console.log("EMAIL", this.collaborationManager.session?.google?.email, "DOC", spreadsheetId)
      if (token && spreadsheetId && channelId && postId && wss) {
        this.disconnect()
        console.log("Connecting to WSS:", wss)
      } else {
        console.warn("Cannot connect to WSS", token, spreadsheetId, channelId, postId, wss)
        return
      }
      this.socket = new ReconnectingWebSocket(wss, [token, spreadsheetId, channelId, postId]) as WebSocket
    
      this.disposers.push(onSnapshot(this.editorStore, debounce(this.handleSnapshot, 500, {maxWait: 1000} )))

    }
  
    disconnect = () => {
      this.socket?.close()
      this.disposers.pop()?.()
    }
  
    handleSnapshot = (newData: EditorManagerLike) => {
      if (!this.isChanged()) return
  
    }
  
    syncUpdate = () => {
  
      const isWebhookChanged = this.editorStore.target.url !== this.doc.data?.target?.url
  
      applySnapshot(this.editorStore, this.doc.data)
      if (isWebhookChanged) {
        void this.editorStore.process("/target/url");
      }
  
      console.log("received change", createHash("md5").update(JSON.stringify(this.doc.data)).digest("base64"))

    }
  
    isChanged = () => !isEqual(getSnapshot(this.editorStore), this.doc.data)
  }