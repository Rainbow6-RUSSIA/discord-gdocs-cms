import { createHash } from "crypto";
import diffMatchPatch from "diff-match-patch"
import { EventEmitter } from "events"
import JSONDiff from "json0-ot-diff"
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { observe } from "mobx";
import { onSnapshot, onPatch, IDisposer, applySnapshot, IJsonPatch, getSnapshot, applyPatch } from "mobx-state-tree";
import { type as json1Type } from "ot-json1"
import ReconnectingWebSocket from "reconnecting-websocket";
import type { Op } from "sharedb";
import ShareDB from "sharedb/lib/client";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import { parseNumbers } from "../helpers/parseNumbers";
import type { CollaborationManager } from "../manager/CollaborationManager";
import { ShareDBCursor } from "./cursor";

ShareDB.types.register(json1Type);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patchToOp(patch: IJsonPatch, reversePatch: IJsonPatch): Op {
  const p = patch.path.slice(1).split("/").map(parseNumbers)
  // const value =   // p.reduce((acc, curr) => acc[curr], current)
  switch (patch.op) {
    case "add": {
      return { p, li: patch.value }
    }
    case "remove": {
      return { p, ld: reversePatch.value }
    }
    case "replace": {
      switch (typeof patch.value) {
        case "string": {
          return { p, od: reversePatch.value, oi: patch.value }
        }
        case "number": return { p, od: reversePatch.value, oi: patch.value }
        default: throw "Unexpected type"
      }
    }
  }

}

export class ShareDBClient extends EventEmitter {
  constructor(collaborationManager: CollaborationManager){
    super();
    this.collaborationManager = collaborationManager;
  }

  socket?: WebSocket;
  connection!: ShareDB.Connection;
  doc!: ShareDB.Doc;
  editorStore!: EditorManagerLike
  collaborationManager!: CollaborationManager

  disposers: IDisposer[] = [];

  cursor: ShareDBCursor | null = null;

  bind = (editorStore: EditorManagerLike) => {
    this.editorStore = editorStore
    this.disposers.push(
      observe(this.collaborationManager, "googleUser", this.connect)
    )
    this.disposers.push(
      observe(this.collaborationManager, "sheet", this.connect)
    )
  }

  dispose = () => {
    this.disconnect()
    for (const dispose of this.disposers) { dispose() }
    this.removeAllListeners()
  }

  connect = () => {
    const token = this.collaborationManager.googleUser?.accessToken; 
    const docId = this.collaborationManager.sheet?.id;
    const channelId = this.collaborationManager.channel?.id;
    const postId = this.collaborationManager.post?.id.toString();
    const wss = process.env.NEXT_PUBLIC_COLLABORATIVE_WSS
    console.log("EMAIL", this.collaborationManager.googleUser?.email, "DOC", docId)
    if (token && docId && channelId && postId && wss) {
      this.disconnect()
      console.log("Connecting to WSS:", wss)
    } else {
      console.warn("Cannot connect to WSS", token, docId, channelId, postId, wss)
      return
    }
    this.socket = new ReconnectingWebSocket(wss, [token, docId, channelId, postId]) as WebSocket
    this.connection = new ShareDB.Connection(this.socket)
    this.doc = this.connection.get(docId, postId)

    this.doc.subscribe(this.syncUpdate)
    this.doc.on("op", this.syncUpdate) // debounce here causes a jumping cursor bug

    this.disposers.push(onSnapshot(this.editorStore, debounce(this.handleSnapshot, 500, {maxWait: 1000} )))
    this.cursor = new ShareDBCursor()
    this.cursor.initTracking()
  }

  disconnect = () => {
    this.cursor?.stopTracking();
    this.socket?.close()
    this.disposers.pop()?.()
  }

  handlePatch = (patch: IJsonPatch, reversePatch: IJsonPatch) => {
    if (!this.isChanged()) return
    
    const op = patchToOp(patch, reversePatch)

    // DEBUG
    const diff = JSONDiff(
      this.doc.data,
      getSnapshot(this.editorStore),
      diffMatchPatch
    )
    console.log("COMPARE", op, diff, JSON.stringify(op) === JSON.stringify(diff[0]))
    // DEBUG

    this.doc.submitOp([op])
  }

  handleSnapshot = (newData: EditorManagerLike) => {
    if (!this.isChanged()) return

    const diff = JSONDiff(
      this.doc.data,
      newData,
      diffMatchPatch
    )
    if (diff.length > 0) this.doc.submitOp(diff)
  }

  syncUpdate = () => {
    if (!this.isChanged()) return

    const isWebhookChanged = this.editorStore.target.url !== this.doc.data?.target?.url

    applySnapshot(this.editorStore, this.doc.data)
    if (isWebhookChanged) {
      void this.editorStore.process("/target/url");
    }

    console.log("received change", createHash("md5").update(JSON.stringify(this.doc.data)).digest("base64"))

    this.cursor!.revertCaretPosition()
  }

  isChanged = () => !isEqual(getSnapshot(this.editorStore), this.doc.data)
}
