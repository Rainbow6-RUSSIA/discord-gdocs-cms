import diffMatchPatch from "diff-match-patch"
import { EventEmitter } from "events"
import JSONDiff from "json0-ot-diff"
import { observe } from "mobx";
import { onSnapshot, onPatch, IDisposer, applySnapshot } from "mobx-state-tree";
import { type as json1Type } from "ot-json1"
import ReconnectingWebSocket from "reconnecting-websocket";
import ShareDB from "sharedb/lib/client";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import type { ExternalServiceManager } from "../header/ExternalServiceManager";
import { debounce } from "../helpers/debounce";

ShareDB.types.register(json1Type);

export class ShareDBClient extends EventEmitter {
  socket?: WebSocket;
  connection!: ShareDB.Connection;
  doc!: ShareDB.Doc;
  // localPresence: unknown;
  ready = false

  disposers: IDisposer[] = [];

  bind = (store: EditorManagerLike, externalService: ExternalServiceManager) => {
    // if (process.browser) {
      this.disposers.push(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        observe(externalService, "googleUser", async () => {
          console.log(externalService.googleUser?.email)
          
          this.init()

          this.disposers.push(onSnapshot(store, this.setJSON))
          this.disposers.push(onPatch(store, (patch) => console.log(patch)))
          
          this.on("apply", () => applySnapshot(store, this.doc.data));
        })
      )
    // }
  }

  dispose = () => {
    this.ready = false
    for (const dispose of this.disposers) { dispose() }
    this.socket?.close()
    this.removeAllListeners()
  }

  init = () => {
    console.log("Connecting to WS:", process.env.NEXT_PUBLIC_COLLABORATIVE_WSS)
    this.socket = new ReconnectingWebSocket(process.env.NEXT_PUBLIC_COLLABORATIVE_WSS!) as WebSocket
    this.connection = new ShareDB.Connection(this.socket)
    this.doc = this.connection.get("app", "post")

    this.doc.subscribe(this.applyNew)
    this.doc.on("op", debounce(this.applyNew, 50))
  }

  setJSON = (newData: EditorManagerLike) => {
    if (this.ready) {
      const diff = JSONDiff(
        this.doc.data,
        newData,
        diffMatchPatch
      )
      console.warn("DIFF", diff)
      if (diff.length > 0) this.doc.submitOp(diff)
    }
  }

  applyNew = () => {
    this.ready = true
    this.emit("apply", this.doc.data)
    console.log("received change")
  }
}
