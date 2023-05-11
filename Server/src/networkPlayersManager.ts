import WebSocket = require("ws");
import Random from "./commonStructures/random";
import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";
import NetworkPlayer from "./networkPlayer";
import Position from "./commonStructures/position";
import NetworkManager from "./networkManager";
import ServerEventType from "./commonStructures/serverEventType";
import InitialGameState from "./commonStructures/initialGameState";
import NetworkPlayerInputState from "./commonStructures/networkPlayerInputState";
import NetworkPlayerGameStateStream from "./commonStructures/networkPlayerGameStateStream";
import iWebSocketClientSend from "./iWebSocketClientSend";

/**
 * Manages the players connected to a network manager
 */
class NetworkPlayersManager {
    private _networkManager : NetworkManager;
    private _clients : Map<iWebSocketClientSend,NetworkPlayer>;
    private _nextClientId : number = 0;

    /**
     * Creates a new NetworkPlayersManager
     * @param networkManager The network manager
     */
    constructor(networkManager:NetworkManager) {
        this._networkManager = networkManager;
        this._clients = new Map<WebSocket,NetworkPlayer>();
    }

    /**
     * Get all the websocket clients
     * @returns The websocket clients list
     */
    public GetClientsList():iWebSocketClientSend[] {
        return Array.from(this._clients.keys());
    }

    /**
     * Get a network player by its websocket (ONLY USED FOR TESTING, DO NOT USE IN PRODUCTION CODE)
     * @param websocket The websocket of the client
     * @returns The network player
     */
    public GetNetworkPlayer(websocket:iWebSocketClientSend):NetworkPlayer | undefined {
        return this._clients.get(websocket);
    }

    /**
     * Joins a new client to the game
     * @param sender The websocket of the client to assign to a player
     * @param name The name of the client
     */
    public OnJoin(sender:iWebSocketClientSend,name:string){
        //Store the attributes of other players before the join (to send them to the new player, without the new player attributes)
        const attributesBeforeJoin = this.GetAllClientsAttributes();

        //Create a new client / spawn attributes
        const clientId = this.GetNextClientId();
        const colorHue:number = Math.round(Random.Range(0,360));
        const networkPlayerFixedAttributes = new NetworkPlayerFixedAttributes(clientId,colorHue,name,/*HexaGrid.GetRandomPlaceOnMap()*/new Position(Random.Range(-10,10),Random.Range(-10,10)));
        this._clients.set(sender,new NetworkPlayer(networkPlayerFixedAttributes));
        
        //Send the initial complete game state to the client
        this._networkManager.SendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(clientId,0,attributesBeforeJoin,[],[]));
        
        //Inform all other clients that a new client joined
        this._networkManager.SendGlobalMessage(ServerEventType.JOINED,networkPlayerFixedAttributes);
    }

    /**
     * Reconnect a new client to an old player (with his ID)
     * @param sender The websocket of the client to assign to a player
     * @param lastId The ID of the player that is reconnecting
     */
    public OnRejoin(sender:iWebSocketClientSend,lastId:number){
        //Store the attributes of other players before the join (to send them to the new player, without the new player attributes)
        const attributesBeforeJoin = this.GetAllClientsAttributes();

        //Reconnect the client
        for(let [websocket,player] of this._clients){
            if(player.fixedAttributes.id == lastId){
                this._clients.delete(websocket);
                this._clients.set(sender,player);
                
                //Immediately update the last seen of the player
                player.UpdateLastSeen();

                //Send the initial complete game state to the client
                this._networkManager.SendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(lastId,player.currentSimulationState.simulationFrame,attributesBeforeJoin,[],[]));

                //Inform all other clients that a new client joined
                this._networkManager.SendGlobalMessage(ServerEventType.JOINED,this._clients.get(sender)?.fixedAttributes);

                break;
            }
        }
    }

    /**
     * When the server receives an input from a client
     * @param sender The websocket of the client that sent the input
     * @param input The new input state of the client
     */
    public OnInput(sender:iWebSocketClientSend,input:NetworkPlayerInputState){
        const player = this._clients.get(sender);
        if(player == undefined) return;
        player.EnqueueInputStream(input);
    }
    
    /**
     * Removes the client from the list of players
     * @param sender The websocket that left
     */
    public OnLeave(sender:WebSocket) {
        const playerDisconnected = this._clients.get(sender);
        if(playerDisconnected == undefined) return;
        this._clients.delete(sender);
        this._networkManager.SendGlobalMessage(ServerEventType.LEFT,playerDisconnected.fixedAttributes.id);
    }

    /**
     * Refresh the players states and send the new game state to all the clients
     */
    public NetworkTick() {
        this._clients.forEach((client)=>{
            if(client.isEnabled){
                client.NetworkTick();
            }else if(!client.isAppearingOffline){
                client.isAppearingOffline = true;
                this._networkManager.SendGlobalMessage(ServerEventType.LEFT,client.fixedAttributes.id);
            }
        });
        const clients = this.GetGameSimulationStateStream();
        if(clients.length > 0)
            this._networkManager.SendGlobalMessage(ServerEventType.GAME_STATE_STREAM,clients);
    }
    
    /**
     * Get all the clients attributes list
     * @returns The list of all the clients attributes
     */
    private GetAllClientsAttributes():NetworkPlayerFixedAttributes[] {
        const clientsAttributes : NetworkPlayerFixedAttributes[] = [];
        this._clients.forEach((client)=>{
            if(client.isEnabled){
                clientsAttributes.push(client.fixedAttributes);
            }
        });
        return clientsAttributes;
    }
    
    /**
     * Get all the clients simulation states list
     * @returns The list of all the clients simulation states
     */
    private GetGameSimulationStateStream():NetworkPlayerGameStateStream[] {
        const simulationStateStream : NetworkPlayerGameStateStream[] = [];
        this._clients.forEach((client)=>{
            if(client.isEnabled){
                simulationStateStream.push(new NetworkPlayerGameStateStream(client.fixedAttributes.id,client.currentSimulationState));
            }
        });
        return simulationStateStream;
    }

    /**
     * Get a unique client id for a new client
     * @returns The next client id
     */
    private GetNextClientId() : number {
        return this._nextClientId++;
    }
}

export default NetworkPlayersManager;