/**
 * Main entry point of the server. This is the transport layer. It will create a websocket server and listen for incoming connections.
 * Created by Eliott Jaquier (08.05.2023)
 */

import WebSocket = require('ws');
import NetworkManager from './networkManager';

const port : number = (process.env.PORT as unknown as number) || 3000;
const wss = new WebSocket.Server({ port: port });
const networkManager = new NetworkManager();

wss.on('connection', (ws) => {
    console.log("Client connected");
    ws.on('message', (message) => {
        console.log("Message received : "+message.toString());
        networkManager.OnMessage(ws,message.toString()); 
    });
    ws.on("close", () => {
        console.log("Client disconnected");
        networkManager.OnClose(ws);
    });
    ws.on("error", (error) => {
        console.log("Error : "+error);
    });
});

console.log("Websocket server started on port "+port);