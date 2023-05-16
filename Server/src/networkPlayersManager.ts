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
import HexaGrid from "./hexagrid";

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
    public getClientsList():iWebSocketClientSend[] {
        return Array.from(this._clients.keys());
    }

    /**
     * Get a network player by its websocket (ONLY USED FOR TESTING, DO NOT USE IN PRODUCTION CODE)
     * @param websocket The websocket of the client
     * @returns The network player
     */
    public getNetworkPlayer(websocket:iWebSocketClientSend):NetworkPlayer | undefined {
        return this._clients.get(websocket);
    }

    /**
     * Joins a new client to the game
     * @param sender The websocket of the client to assign to a player
     * @param name The name of the client
     */
    public onJoin(sender:iWebSocketClientSend,name:string){
        //Store the attributes of other players before the join (to send them to the new player, without the new player attributes)
        const attributesBeforeJoin = this.getAllClientsAttributes();

        //Create a new client / spawn attributes
        const clientId = this.getNextClientId();
        const colorHue:number = Math.round(Random.Range(0,360));
        const networkPlayerFixedAttributes = new NetworkPlayerFixedAttributes(clientId,colorHue,name,HexaGrid.getRandomPlaceOnMap());
        
        //Spawn the new client to the list of clients
        const newPlayer = new NetworkPlayer(networkPlayerFixedAttributes);
        this._clients.set(sender,newPlayer);

        //Send the initial complete game state to the client
        this._networkManager.sendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(clientId,0,attributesBeforeJoin,this._networkManager.objectsManager.getAllObjectsSpawnAttributes(),[],this._networkManager.hexaGrid.getFullOwnedHexagonList()));
        
        //Inform all other clients that a new client joined
        this._networkManager.sendGlobalMessage(ServerEventType.JOINED,networkPlayerFixedAttributes);

        //Create a base for the new player
        newPlayer.createBase(this._networkManager);
    }

    /**
     * Reconnect a new client to an old player (with his ID)
     * @param sender The websocket of the client to assign to a player
     * @param lastId The ID of the player that is reconnecting
     */
    public onRejoin(sender:iWebSocketClientSend,lastId:number){
        //Store the attributes of other players before the join (to send them to the new player, without the new player attributes)
        const attributesBeforeJoin = this.getAllClientsAttributes();

        //Reconnect the client
        for(let [websocket,player] of this._clients){
            if(player.fixedAttributes.id == lastId){
                this._clients.delete(websocket);
                this._clients.set(sender,player);
                
                //Immediately update the last seen of the player
                player.updateLastSeen();

                //Send the initial complete game state to the client
                this._networkManager.sendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(lastId,player.currentSimulationState.simulationFrame,attributesBeforeJoin,this._networkManager.objectsManager.getAllObjectsSpawnAttributes(),[],this._networkManager.hexaGrid.getFullOwnedHexagonList()));

                return;
            }
        }

        //If the player was not found, send a game over message
        this._networkManager.sendMessage(sender,ServerEventType.GAME_OVER,null);
    }

    /**
     * When the server receives an input from a client
     * @param sender The websocket of the client that sent the input
     * @param input The new input state of the client
     */
    public onInput(sender:iWebSocketClientSend,input:NetworkPlayerInputState){
        const player = this._clients.get(sender);
        if(player == undefined) return;
        player.enqueueInputStream(input);
    }
    
    /**
     * Removes the client from the list of players
     * @param sender The websocket that left
     */
    public onLeave(sender:iWebSocketClientSend) {
        const playerDisconnected = this._clients.get(sender);
        if(playerDisconnected == undefined) return;
        const hexagonsToClear = this._networkManager.hexaGrid.getHexagonsOfBase(playerDisconnected.base)!;
        while(hexagonsToClear.length > 0){
            this._networkManager.hexaGrid.setHexagonProperty(hexagonsToClear[0],null);
        }
        for(let ownedHexagons of this._networkManager.hexaGrid.getHexagonsOfBase(playerDisconnected.base)!){
            this._networkManager.hexaGrid.setHexagonProperty(ownedHexagons,null);
        }
        this._clients.delete(sender);
        this._networkManager.sendGlobalMessage(ServerEventType.LEFT,playerDisconnected.fixedAttributes.id);
    }

    /**
     * Refresh the players states and send the new game state to all the clients
     */
    public networkTick() {
        this._clients.forEach((client)=>{
            if(client.isEnabled){
                client.networkTick();
            }
        });
        const clients = this.getGameSimulationStateStream();
        if(clients.length > 0)
            this._networkManager.sendGlobalMessage(ServerEventType.GAME_STATE_STREAM,clients);
    }
    
    /**
     * Get all the clients attributes list
     * @returns The list of all the clients attributes
     */
    private getAllClientsAttributes():NetworkPlayerFixedAttributes[] {
        const clientsAttributes : NetworkPlayerFixedAttributes[] = [];
        this._clients.forEach((client)=>{
            clientsAttributes.push(client.fixedAttributes);
        });
        return clientsAttributes;
    }
    
    /**
     * Get all the clients simulation states list
     * @returns The list of all the clients simulation states
     */
    private getGameSimulationStateStream():NetworkPlayerGameStateStream[] {
        const simulationStateStream : NetworkPlayerGameStateStream[] = [];
        this._clients.forEach((client)=>{
            simulationStateStream.push(new NetworkPlayerGameStateStream(client.fixedAttributes.id,client.currentSimulationState));
        });
        return simulationStateStream;
    }

    /**
     * Get a unique client id for a new client
     * @returns The next client id
     */
    private getNextClientId() : number {
        return this._nextClientId++;
    }
}

export default NetworkPlayersManager;