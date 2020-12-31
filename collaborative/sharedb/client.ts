import diffMatchPatch from "diff-match-patch"
import { EventEmitter } from "events"
import JSONDiff from "json0-ot-diff"
import { type as json1Type } from "ot-json1"
import ReconnectingWebSocket from "reconnecting-websocket";
import ShareDB from "sharedb/lib/client";
import { debounce } from "../helpers/debounce";

ShareDB.types.register(json1Type);

export class ShareDBClient extends EventEmitter {
  constructor () {
    super()
    console.log(`Connecting to WS: ${process.env.NEXT_PUBLIC_COLLABORATIVE_WSS}`)
    this.socket = new ReconnectingWebSocket(process.env.NEXT_PUBLIC_COLLABORATIVE_WSS!) as WebSocket
    this.connection = new ShareDB.Connection(this.socket)
    this.doc = this.connection.get("app", "post")

    this.doc.subscribe(this.applyNew)
    this.doc.on("op", this.applyNew)
  }
  socket: WebSocket;
  connection: ShareDB.Connection;
  doc: ShareDB.Doc;
  localPresence: unknown;
  ready = false

  setJSON(newData: unknown) {
    if (this.ready) {
      const diff = JSONDiff(
        this.doc.data,
        newData,
        diffMatchPatch
      )
      if (diff.length > 0) {
        this.doc.submitOp(diff)
        console.log(diff)
      }
    }
  }

  applyNew = () => {
    this.ready = true
    debounce(() => this.emit("apply", this.doc.data), 50)
  }

}
