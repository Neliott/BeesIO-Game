import iWebSocketClientSend from "../iWebSocketClientSend";

export default class WebSocketMock implements iWebSocketClientSend {
    public dataSent: any[] = [];
    public send(data: any){
        this.dataSent.push(data);
    }
}