import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import express from "express";
import http from "http";
import ShareDB from "sharedb";
import WebSocket from "ws";
import { DEFAULT_EDITOR_MANAGER_STATE } from "../../modules/editor/defaultEditorManagerState";
import { EditorManager } from "../../modules/editor/EditorManager";
import { TempMemoryDB } from "./TempMemoryDb";

class ShareDBServer {
  static initialData = EditorManager.create(DEFAULT_EDITOR_MANAGER_STATE);

  constructor() {
    this.tempMemoryDb = new TempMemoryDB()
    this.backend = new ShareDB({ db: this.tempMemoryDb })
    this.connection = this.backend.connect();
    void this.startServer();
  }

  tempMemoryDb: TempMemoryDB
  connection: ShareDB.Connection
  backend: ShareDB

  initDoc = async (name: string, data: unknown = ShareDBServer.initialData) => {
    const doc = this.connection.get("app", name);
    await new Promise((res, rej) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      doc.fetch((err) => err ? rej(err) : res(""))
    })
  
    if (doc.type === null) {
      await new Promise(res => { doc.create(data, res) } );
    }
  }

  startServer = async () => {
    await this.initDoc("post")
    await this.initDoc("post1")
    this.tempMemoryDb.deleteDoc("app", "post1")

    const app = express();
    const server = http.createServer(app);
  
    const wss = new WebSocket.Server({server});
  
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    wss.on("connection", async (ws, req) => {
      const token = req.headers["sec-websocket-protocol"]
      const stream = new WebSocketJSONStream(ws);
      this.backend.listen(stream);
    });
  
    server.listen(process.env.WSS_PORT);
    console.log(`Listening ${process.env.WSS_PORT}`);
  }
}

export default new ShareDBServer()

