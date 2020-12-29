declare module "@teamwork/websocket-json-stream" {
    import * as stream from "stream";
    import WS from "ws";

    declare class WebSocketJSONStream extends stream.Duplex {
        constructor(ws: WS);

        ws: WS;
    }

    declare namespace WebSocketJSONStream {}

    export = WebSocketJSONStream;
}