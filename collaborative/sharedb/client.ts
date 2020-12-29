import ReconnectingWebSocket from "reconnecting-websocket";
import sharedb from "sharedb/lib/client";

// Open WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket(`ws://${window.location.host}:8080`) as WebSocket;
const connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
const doc = connection.get("examples", "counter");

function showNumbers() {
  console.log(doc.data.numClicks);
};

// When clicking on the '+1' button, change the number in the local
// document and sync the change to the server and other connected
// clients
function increment() {
  // Increment `doc.data.numClicks`. See
  // https://github.com/ottypes/json0 for list of valid operations.
  doc.submitOp([{p: ["numClicks"], na: 1}]);
}

// Get initial value of document and subscribe to changes
doc.subscribe(showNumbers);
// When document changes (by this client or any other, or the server),
// update the number on the page
doc.on("op", showNumbers);

// Expose to index.html
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.increment = increment;