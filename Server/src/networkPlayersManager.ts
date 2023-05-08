import Random from "./commonStructures/random";
import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";
import NetworkPlayer from "./networkPlayer";
import Position from "./commonStructures/position";
import NetworkManager from "./networkManager";
import WebSocket = require("ws");
import ServerEventType from "./commonStructures/serverEventType";
import InitialGameState from "./commonStructures/initialGameState";

class NetworkPlayersManager {
    private _networkManager : NetworkManager;
    private _clients : Map<WebSocket,NetworkPlayer>;
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
    public GetClientsList():WebSocket[] {
        return Array.from(this._clients.keys());
    }

    /**
     * Joins a new client to the game
     * @param sender The websocket of the client to assign to a player
     * @param name The name of the client
     */
    public Join(sender:WebSocket,name:string){
        //Store the attributes of other players before the join (to send them to the new player, without the new player attributes)
        const attributesBeforeJoin = this.GetAllClientsAttributes();

        //Create a new client / spawn attributes
        const clientId = this.GetNextClientId();
        const colorHue:number = Random.Range(0,360);
        const networkPlayerFixedAttributes = new NetworkPlayerFixedAttributes(clientId,colorHue,name,/*HexaGrid.GetRandomPlaceOnMap()*/new Position(Random.Range(-10,10),Random.Range(-10,10)));
        this._clients.set(sender,new NetworkPlayer(networkPlayerFixedAttributes));
        
        //Send the initial complete game state to the client
        this._networkManager.SendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(clientId,0,attributesBeforeJoin,[],[]));
        
        //Inform all other clients that a new client joined
        this._networkManager.SendGlobalMessage(ServerEventType.JOINED,networkPlayerFixedAttributes);
    }
    
    /**
     * Removes the client from the list of players
     * @param sender The websocket that left
     */
    public Leave(sender:WebSocket) {
        const playerDisconnected = this._clients.get(sender);
        if(playerDisconnected == undefined) return;
        this._clients.delete(sender);
        this._networkManager.SendGlobalMessage(ServerEventType.LEFT,playerDisconnected.fixedAttributes.id);
    }
    
    /**
     * Get all the clients attributes list
     * @returns The list of all the clients attributes
     */
    private GetAllClientsAttributes():NetworkPlayerFixedAttributes[] {
        const clients : NetworkPlayerFixedAttributes[] = [];
        this._clients.forEach((client)=>{
            clients.push(client.fixedAttributes);
        });
        return clients;
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