import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import express from "express";
import http from "http";
import ShareDB from "sharedb";
import WebSocket from "ws";

const backend = new ShareDB();

// Create initial document then fire callback
function createDoc(callback: () => void) {
  const connection = backend.connect();
  const doc = connection.get("examples", "counter");
  doc.fetch((err) => {
    if (err) throw err;
    if (doc.type === null) {
      doc.create({numClicks: 0}, callback);
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections 
  const app = express();
  const server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  const wss = new WebSocket.Server({server});
  wss.on("connection", (ws) => {
    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
  console.log("Listening on http://localhost:8080");
}

createDoc(startServer);
