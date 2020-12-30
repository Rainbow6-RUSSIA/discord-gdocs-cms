/* eslint-disable @typescript-eslint/ban-ts-comment */
import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import express from "express";
import http from "http";
import ShareDB from "sharedb";
import WebSocket from "ws";
import { DEFAULT_EDITOR_MANAGER_STATE } from "../../modules/editor/defaultEditorManagerState";
import { EditorManager } from "../../modules/editor/EditorManager";

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

  server.listen(8080);
  console.log("Listening http://localhost:8080");
}

void main();

