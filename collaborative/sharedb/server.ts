/* eslint-disable @typescript-eslint/ban-ts-comment */
import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import { config } from "dotenv"
import express from "express";
import http from "http";
import ShareDB from "sharedb";
import { URL } from "url";
import WebSocket from "ws";
import { DEFAULT_EDITOR_MANAGER_STATE } from "../../modules/editor/defaultEditorManagerState";
import { EditorManager } from "../../modules/editor/EditorManager";

config()

const initialData = EditorManager.create(DEFAULT_EDITOR_MANAGER_STATE);

async function main() {
  // @ts-ignore
  const backend = new ShareDB({presence: true});
  const connection = backend.connect();
  const doc = connection.get("app", "post");
  await new Promise((res, rej) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    doc.fetch((err) => err ? rej(err) : res(""))
  })

  if (doc.type === null) {
    await new Promise(res => { doc.create(initialData, res) } );
  }

  const app = express();
  const server = http.createServer(app);

  const wss = new WebSocket.Server({server});

  wss.on("connection", (ws) => {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  const wssUrl = new URL(process.env.NEXT_PUBLIC_COLLABORATIVE_WSS!)
  server.listen(wssUrl.port);
  console.log(`Listening ${wssUrl.href}`);
}

void main();

