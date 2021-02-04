import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import express from "express";
import http from "http";
import ShareDB from "sharedb";
import type Agent from "sharedb/lib/agent";
import WebSocket from "ws";
import { DEFAULT_EDITOR_MANAGER_STATE } from "../../modules/editor/defaultEditorManagerState";
import { EditorManager } from "../../modules/editor/EditorManager";
import { getGoogleProfile } from "../helpers/google";
import type { CollaborativeServerContext } from "../types";
import { CollaborativeSession } from "./CollaborativeSession";
import { TempMemoryDB } from "./TempMemoryDb";

class ShareDBServer {
  static initialData = EditorManager.create(DEFAULT_EDITOR_MANAGER_STATE);

  constructor() {
    this.tempMemoryDb = new TempMemoryDB()
    this.backend = new ShareDB({ db: this.tempMemoryDb })
    this.connection = this.backend.connect();
    void this.startServer();

    this.backend.use("connect", (request, next) => {
      console.log(request.req)
      next();
    });
  }

  tempMemoryDb: TempMemoryDB
  connection: ShareDB.Connection
  backend: ShareDB

  initDoc = async (collection: string, name: string, data: unknown = ShareDBServer.initialData) => {
    const doc = this.connection.get(collection, name);
    await new Promise((res, rej) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      doc.fetch((err) => err ? rej(err) : res(""))
    })
  
    if (doc.type === null) {
      await new Promise(res => { doc.create(data, res) } );
    }
  }

  startServer = async () => {
    const app = express();
    const server = http.createServer(app);
  
    const wss = new WebSocket.Server({server});
  
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    wss.on("connection", async (ws, req) => {
      console.log(req.headers)
      const dataHeader = req.headers["sec-websocket-protocol"]
      if (!dataHeader) return ws.terminate();
      const [token, spreadsheetId, channelId, postId] = dataHeader.split(", ");

      try {

        const collaborativeSession = new CollaborativeSession({ token, spreadsheetId, channelId, postId });

        await collaborativeSession.init();
        const data = await collaborativeSession.getData()
        await this.initDoc(spreadsheetId, `${channelId}/${postId}`, data)

        const stream = new WebSocketJSONStream(ws);
        // console.log(token, ws.protocol)
        
        ws.on("close", () => console.log("Close"));
        // ws.on("", () => console.log("Close"))

        // https://github.com/dmapper/sharedb-access/issues/8
        (this.backend.listen as (stream: WebSocketJSONStream, data: CollaborativeSession) => void)(stream, collaborativeSession);
      } catch (error) {
        console.log(error)
        ws.terminate();
      }
    });
  
    server.listen(process.env.WSS_PORT);
    console.log(`Listening ${process.env.WSS_PORT}`);
  }
}

export default new ShareDBServer()

