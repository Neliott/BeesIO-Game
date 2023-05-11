import WebSocket = require('ws');
import ClientEventType from './commonStructures/clientEventType';
import ServerEventType from './commonStructures/serverEventType';
import NetworkPlayersManager from './networkPlayersManager';
import iWebSocketClientSend from './iWebSocketClientSend';

/**
 * This manager is used to manage the network (serialize the game state, send it to the clients, receive the inputs, etc.) and the different services managing the game state
 */
class NetworkManager {
    /**
     * The time in milliseconds before a client is considered disconnected
     * This is not readonly because it can be changed for the tests
     */
    public static CONNECTION_TIMEOUT:number = 2000;
    /**
     * The number of ticks per seconds
     */
    public static readonly TICK_PER_SECONDS:number = 10;
    /**
     * The time in seconds between each tick
     */
    public static readonly TICK_INTERVAL:number = 1 / NetworkManager.TICK_PER_SECONDS;

    private _clientsManager : NetworkPlayersManager;

    /**
     * Returns the clients manager
     */
    public get clientsManager() : NetworkPlayersManager {
        return this._clientsManager;
    }

    /**
     * Creates a new NetworkManager (new room with services)
     */
    constructor(initialiseTimer:boolean = true) {
        this._clientsManager = new NetworkPlayersManager(this);
        if(initialiseTimer){
            setInterval(()=>{
                this.NetworkTick();
            },NetworkManager.TICK_INTERVAL*1000);
        }
    }

    /**
     * Sends a message to the target
     * @param target The websocket of the target
     * @param type The type of the message
     * @param data The additional data of the message
     */
    public SendMessage(target:iWebSocketClientSend,type:ServerEventType,data:any){
        console.log("Sending message : "+this.EncodeMessage(type,data));
        target.send(this.EncodeMessage(type,data));
    }

    /**
     * Sends a message to all the connected clients
     * @param type The type of the message
     * @param data The additional data of the message
     */
    public SendGlobalMessage(type:ServerEventType,data:any){
        const messageEncoded = this.EncodeMessage(type,data);
        console.log("Sending global message : "+messageEncoded);
        this._clientsManager.GetClientsList().forEach((wsClient)=>{
            wsClient.send(messageEncoded);
        });
    }

    /**
     * Deserializes the message and calls the appropriate function
     */
    public OnMessage(sender:iWebSocketClientSend,message:string) {
        const index = message.indexOf("|");
        const eventType:ClientEventType = parseInt(message.substring(0,index)) as ClientEventType;
        const json = message.substring(index+1);

        switch (eventType) {
            case ClientEventType.JOIN:
                this._clientsManager.OnJoin(sender,JSON.parse(json));
                break;
            case ClientEventType.REJOIN:
                this._clientsManager.OnRejoin(sender,JSON.parse(json));
                break;
            case ClientEventType.INPUT_STREAM:
                this._clientsManager.OnInput(sender,JSON.parse(json));
                break;
            default:
                break;
        }
    }

    /**
     * Removes the client from the list of connected clients
     * @param sender The websocket of the client disconnected
     */
    public OnClose(sender:WebSocket) {
        this._clientsManager.OnLeave(sender);
    }

    /**
     * Tick the network (refresh the game state, etc.)
     * Note : THIS IS PUBLIC ONLY FOR TESTING PURPOSES
     */
    public NetworkTick(){
        this._clientsManager.NetworkTick();
    }

    private EncodeMessage(type:ServerEventType,data:any):string{
        return type.valueOf()+"|"+JSON.stringify(data);
    }
}

export default NetworkManager;