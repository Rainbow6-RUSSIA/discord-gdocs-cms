import { createHash } from "crypto";
import diffMatchPatch from "diff-match-patch"
import { EventEmitter } from "events"
import JSONDiff from "json0-ot-diff"
import debounce from "lodash.debounce";
import { observe } from "mobx";
import { onSnapshot, onPatch, IDisposer, applySnapshot, IJsonPatch, getSnapshot, applyPatch } from "mobx-state-tree";
import { type as json1Type } from "ot-json1"
import ReconnectingWebSocket from "reconnecting-websocket";
import type { Op } from "sharedb";
import ShareDB from "sharedb/lib/client";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import type { ExternalServiceManager } from "../header/ExternalServiceManager";

ShareDB.types.register(json1Type);

function parseNumbers(value: string) {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? value : n
}

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

const isAllowedElement = (element: EventTarget | null): 
element is HTMLTextAreaElement | HTMLInputElement =>
  element instanceof HTMLTextAreaElement
  || element instanceof HTMLInputElement

const isAllowedEvent = (event: Event) => 
  !(event instanceof KeyboardEvent)
  || ["Arrow", "Page", "Home", "End"].some(s => event.key.startsWith(s))

export class ShareDBClient extends EventEmitter {
  socket?: WebSocket;
  connection!: ShareDB.Connection;
  doc!: ShareDB.Doc;
  editorStore!: EditorManagerLike
  externalServiceStore!: ExternalServiceManager

  disposers: IDisposer[] = [];

  bind = (editorStore: EditorManagerLike, externalServiceStore: ExternalServiceManager) => {
    this.editorStore = editorStore
    this.externalServiceStore = externalServiceStore
    this.disposers.push(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      observe(this.externalServiceStore, "googleUser", async () => {          
        console.log("EMAIL", this.externalServiceStore.googleUser?.email)
        
        if (this.externalServiceStore.googleUser?.email) {
          this.init()
          this.disposers.push(onSnapshot(this.editorStore, debounce(this.handleSnapshot, 500, {maxWait: 1000} )))
          this.hookFocus()
        }
        // this.disposers.push(onPatch(this.editorStore, this.handlePatch))
      })
    )
  }

  hookFocus = () => {
    document.addEventListener("focusin", this.focusIn)
    document.addEventListener("focusout", this.focusOut)
  }

  unhookFocus = () => {
    document.removeEventListener("focusin", this.focusIn)
    document.removeEventListener("focusout", this.focusOut)
  }

  hookChange = (target: HTMLElement) => { 
    target.addEventListener("click", this.cursorHandle)
    target.addEventListener("input", this.cursorHandle)
    target.addEventListener("keydown", this.cursorHandle)
    target.addEventListener("select", this.cursorHandle)
  }
  unhookChange = (target: HTMLElement) => {
    target.removeEventListener("click", this.cursorHandle)
    target.removeEventListener("input", this.cursorHandle)
    target.removeEventListener("keydown", this.cursorHandle)
    target.removeEventListener("select", this.cursorHandle)
  }

  focusIn = ({ target }: FocusEvent) => {
    if (isAllowedElement(target)) {
      // console.log("FOCUSIN", e.target.tagName, e)
      target.style.transform = "translate(10px, -10px)"
      this.hookChange(target)
      
    }
  }

  focusOut = ({ target }: FocusEvent) => { 
    if (isAllowedElement(target)) {    
      // console.log("FOCUSOUT", e.target.tagName, e)
      target.style.transform = ""
      this.unhookChange(target)
    }
  }

  cursorHandle = debounce(
    (e: Event) => {
      const { target } = e;
      if (isAllowedElement(target) && isAllowedEvent(e)) {
        console.log("cursorHandle", target)
        console.log(target.selectionStart, target.selectionEnd) // setInterval(() => temp1.setSelectionRange(i, i++), 1000)
      }
    }, 50, {maxWait: 100})

  dispose = () => {
    for (const dispose of this.disposers) { dispose() }
    this.unhookFocus();
    this.socket?.close()
    this.removeAllListeners()
  }

  init = () => {
    console.log("Connecting to WS:", process.env.NEXT_PUBLIC_COLLABORATIVE_WSS)
    this.socket = new ReconnectingWebSocket(process.env.NEXT_PUBLIC_COLLABORATIVE_WSS!) as WebSocket
    this.connection = new ShareDB.Connection(this.socket)
    this.doc = this.connection.get("app", "post")

    this.doc.subscribe(this.syncUpdate)
    this.doc.on("op", debounce(this.syncUpdate, 50))
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
  }

  isChanged = () => {
    return JSON.stringify(getSnapshot(this.editorStore)) !== JSON.stringify(this.doc.data)
  }
}
