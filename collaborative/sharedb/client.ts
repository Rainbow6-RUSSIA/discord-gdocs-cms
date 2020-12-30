import diffMatchPatch from "diff-match-patch"
import JSONDiff from "json0-ot-diff"
import { type as json1Type } from "ot-json1"
import ReconnectingWebSocket from "reconnecting-websocket";
import ShareDB from "sharedb/lib/client";

ShareDB.types.register(json1Type);

export class ShareDBClient {
  constructor () {
    this.socket = new ReconnectingWebSocket(`ws://${window.location.hostname}:8080`) as WebSocket
    this.connection = new ShareDB.Connection(this.socket)
    this.doc = this.connection.get("app", "post")

    this.doc.subscribe(this.log);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const presence = this.connection.getDocPresence("app", "post");
    const presenceId = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    this.localPresence = presence.create(presenceId);

    presence.on("receive", console.log);

  }
  socket: WebSocket;
  connection: ShareDB.Connection;
  doc: ShareDB.Doc;
  localPresence: unknown;

  log = () => {
    console.log(this.doc.data);
  }

  setJSON(newData: unknown) {
    const diff = JSONDiff(
      this.doc.data,
      newData,
      diffMatchPatch
    )
    this.doc.submitOp(diff);
  }

}
