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
    this.db = new TempMemoryDB()
    this.backend = new ShareDB({ db: this.db })
    this.connection = this.backend.connect();
    void this.startServer();

    // this.backend.use("connect", (request, next) => {
    //   request.agent.custom = request.req
    //   next();
    // });
    // this.backend.use("submit", (context, next) => {
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //   console.log("SUBMIT FROM", (context.agent.custom as CollaborativeServerContext | undefined)?.member?.email)
    //   next();
    // })
  }

  db: TempMemoryDB
  connection: ShareDB.Connection
  backend: ShareDB
  sessions: Map<string, CollaborativeSession> = new Map()

  initDoc = async (collection: string, name: string, session: CollaborativeSession) => {
    
    const doc = this.connection.get(collection, name);
    await new Promise((res, rej) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      doc.fetch((err) => err ? rej(err) : res(""))
    })
  
    if (doc.type === null) {
      const data = await session.getInitialData()
      await new Promise(res => { doc.create(data, res) } );
    }
  }

  startServer = () => {
    const app = express();
    const server = http.createServer(app);
  
    const wss = new WebSocket.Server({server});
  
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    wss.on("connection", this.connectionHandler);
  
    server.listen(process.env.WSS_PORT);
    console.log(`Listening ${process.env.WSS_PORT}`);
  }

  connectionHandler = async (ws: WebSocket, req: http.IncomingMessage) => {
    const dataHeader = req.headers["sec-websocket-protocol"]
    if (!dataHeader) return ws.terminate();
    const [token, spreadsheetId, channelId, postId] = dataHeader.split(", ");

    try {
      const docName = `${channelId}/${postId}`
      const profile = await getGoogleProfile(token)
      console.log("CONNECT", profile.email)
      
      const session = new CollaborativeSession({ token, spreadsheetId, channelId, postId });
      await session.start()

      await this.initDoc(spreadsheetId, docName, session)

      const stream = new WebSocketJSONStream(ws);
      
      ws.on("close", () => console.log("Close"));

      // https://github.com/dmapper/sharedb-access/issues/8
      // (this.backend.listen as (stream: WebSocketJSONStream, data: CollaborativeServerContext) => void)(stream, {profile, document});
      this.backend.listen(stream)
    } catch (error) {
      console.log("CONNECTION ERROR", error)
      ws.terminate();
    }
  }

  startSession = async (path: string, session: CollaborativeSession) => {
    await session.start()
    this.sessions.set(path, session)
  }

  stopSession = async (path: string) => {
    await this.sessions.get(path)?.stop()
    this.sessions.delete(path)
  }
}

export default new ShareDBServer()

