import WebSocket = require('ws');

//Can deploy on Glitch.com https://glitch.com/edit/#!/wss-test-glitch?path=server.js%3A30%3A14
const port : number = (process.env.PORT as unknown as number) || 3000;
const wss = new WebSocket.Server({ port: port });

wss.on('connection', (ws) => {
    console.log("Client connected");
    ws.on('message', (messageAsString) => {
        console.log("Message received : "+messageAsString.toString());
    });
    ws.on("close", () => {
        console.log("Client disconnected");
    });
    ws.on("error", (error) => {
        console.log("Error : "+error);
    });
});
console.log("Websocket server started on port "+port);