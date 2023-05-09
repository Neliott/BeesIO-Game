/**
 * This simple interface is used to send data to a websocket client. It is used in all managers to abstract the websocket implementation and mock it for testing.
 */
export default interface iWebSocketClientSend {
    send: (data: any) => void;
}