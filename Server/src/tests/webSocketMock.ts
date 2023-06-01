import iWebSocketClientSend from "../iWebSocketClientSend";

/**
 * A mock (stub) of the websocket client
 */
export default class WebSocketMock implements iWebSocketClientSend {
    /**
     * The data sent by the client (JSON stringified)
     */
    public dataSent: any[] = [];
    /**
     * Enquere new message
     * @param data The data to send
     */
    public send(data: any){
        this.dataSent.push(data);
    }
}