import WebSocket = require("ws");
import Random from "../commonStructures/random";
import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import NetworkPlayer from "./networkPlayer";
import ServerEventType from "../commonStructures/serverEventType";
import InitialGameState from "../commonStructures/initialGameState";
import NetworkPlayerInputState from "../commonStructures/networkPlayerInputState";
import NetworkPlayerGameStateStream from "../commonStructures/networkPlayerGameStateStream";
import iWebSocketClientSend from "../iWebSocketClientSend";
import HexaGrid from "../hexagrid";
import NetworkOwnedObjectsList from "../commonStructures/networkOwnedObjectsList";
import iNetworkManager from "../iNetworkManager";
import NetworkDropAttributes from "../commonStructures/networkDropAttributes";
import NetworkObjectDropAttributes from "../commonStructures/networkObjectDropAttributes";
import NetworkBot from "../players/networkBot";

/**
 * Manages the players connected to a network manager
 */
export default class NetworkPlayersManager {
    private static readonly TARGET_PLAYERS : number = 20;

    private _networkManager : iNetworkManager;
    private _clients : Map<iWebSocketClientSend,NetworkPlayer>;
    private _bots : NetworkBot[] = [];
    private _nextClientId : number = 0;

    /**
     * Creates a new NetworkPlayersManager
     * @param networkManager The network manager
     */
    constructor(networkManager:iNetworkManager) {
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
     * Get all the players (physical and virtual)
     * @returns The players list
     */
    public getPlayersList():NetworkPlayer[] {
        return Array.from(this._clients.values()).concat(this._bots as NetworkPlayer[]);
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
        const colorHue:number = Math.round(Random.rangeInt(0,360));
        const networkPlayerFixedAttributes = new NetworkPlayerFixedAttributes(clientId,colorHue,name,HexaGrid.getRandomPlaceOnMap());
        
        //Spawn the new client to the list of clients
        const newPlayer = new NetworkPlayer(this._networkManager,networkPlayerFixedAttributes);
        this._clients.set(sender,newPlayer);

        //Send the initial complete game state to the client
        this._networkManager.sendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(clientId,0,attributesBeforeJoin,this._networkManager.objectsManager.getAllObjectsSpawnAttributes(),this.getAllPickupObjects(),this._networkManager.hexaGrid.getFullOwnedHexagonList()));

        //Inform all other clients that a new client joined
        this._networkManager.sendGlobalMessage(ServerEventType.JOINED,networkPlayerFixedAttributes);

        //Create a base for the new player
        newPlayer.createBase();
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
                this._networkManager.sendMessage(sender,ServerEventType.INITIAL_GAME_STATE,new InitialGameState(lastId,player.currentSimulationState.simulationFrame,attributesBeforeJoin,this._networkManager.objectsManager.getAllObjectsSpawnAttributes(),this.getAllPickupObjects(),this._networkManager.hexaGrid.getFullOwnedHexagonList()));

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
     * Removes the client from the list of players (and unregister associated objects)
     * @param sender The websocket that left
     */
    public onLeave(sender:iWebSocketClientSend) {
        const playerDisconnected = this._clients.get(sender);
        if(playerDisconnected == undefined) return;
        this.removePlayer(playerDisconnected,false);
    }

    /**
     * Remove the player from the list of players and send a game over message to the client
     * @param player The player to remove (game over)
     * @param isGameOver If the game is over for this player (or he just left)
     */
    public removePlayer(player:NetworkPlayer,isGameOver:boolean){
        let sender : iWebSocketClientSend = this.getWebSocketByPlayer(player)!;
        this.drop(player);
        const hexagonsToClear = this._networkManager.hexaGrid.getHexagonsOfBase(player.base)!;
        while(hexagonsToClear.length > 0){
            this._networkManager.hexaGrid.setHexagonProperty(hexagonsToClear[0],null);
        }
        for(let ownedHexagons of this._networkManager.hexaGrid.getHexagonsOfBase(player.base)!){
            this._networkManager.hexaGrid.setHexagonProperty(ownedHexagons,null);
        }
        if(sender != undefined)
            this._clients.delete(sender);
        else
            this._bots.splice(this._bots.indexOf(player as NetworkBot),1);
        this._networkManager.sendGlobalMessage(isGameOver?ServerEventType.GAME_OVER:ServerEventType.LEFT,player.fixedAttributes.id);
    }

    /**
     * Try to add a object to the player that sent the pickup request
     * @param sender The websocket of the client that sent the pickup request
     */
    public onPickup(sender:iWebSocketClientSend){
        const player = this._clients.get(sender);
        if(player == undefined) return;
        let pickedUpObject = player.tryToPickup();
        if(pickedUpObject == null) return;
        this._networkManager.sendGlobalMessage(ServerEventType.PICKUP,new NetworkOwnedObjectsList(player.fixedAttributes.id,[pickedUpObject.spawnAttributes.id]));
    }

    /**
     * Remove all owned objects of the player that sent the drop request
     * @param sender The websocket of the client that sent the drop request
     */
    public onDrop(sender:iWebSocketClientSend){
        const player = this._clients.get(sender);
        if(player == undefined || player.pickupNetworkObjects.length == 0) return;
        this.drop(player);
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
        this._bots.forEach((bot)=>{
            bot.networkTick();
        });
        if(NetworkPlayersManager.TARGET_PLAYERS - (this._clients.size+this._bots.length) > 0){
            this.spawnBot();
        }
        this._networkManager.sendGlobalMessage(ServerEventType.GAME_STATE_STREAM,this.getGameSimulationStateStream());
    }

    private spawnBot(){
        //Create spawn attributes
        const clientId = this.getNextClientId();
        const colorHue:number = Math.round(Random.rangeInt(0,360));
        const networkPlayerFixedAttributes = new NetworkPlayerFixedAttributes(clientId,colorHue,"Bot"+Random.rangeInt(100,900),HexaGrid.getRandomPlaceOnMap());
        
        //Spawn the new client to the list of clients
        const newPlayer = new NetworkBot(this._networkManager,networkPlayerFixedAttributes);
        this._bots.push(newPlayer);

        //Inform all other clients that a new client joined
        this._networkManager.sendGlobalMessage(ServerEventType.JOINED,networkPlayerFixedAttributes);

        //Create a base for the new player
        newPlayer.createBase();
    }

    private drop(player:NetworkPlayer){
        let objectsDropped = player.drop();
        let objectsDroppedAttributes = objectsDropped.map((object)=>{
            return new NetworkObjectDropAttributes(object.spawnAttributes.position,object.spawnAttributes.id)
        });
        let dropAttributes = new NetworkDropAttributes(player.fixedAttributes.id,objectsDroppedAttributes);
        this._networkManager.sendGlobalMessage(ServerEventType.DROP,dropAttributes);
    }

    /**
     * Find the websocket of a player by its reference
     * @param player The player to find
     * @returns The websocket of the player or undefined if not found
     */
    private getWebSocketByPlayer(player:NetworkPlayer):iWebSocketClientSend | undefined {
        for (const [key, value] of this._clients.entries()) {
            if(value === player){
                return key;
            }
        }
        return undefined;
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
        this._bots.forEach((bot)=>{
            clientsAttributes.push(bot.fixedAttributes);
        });
        return clientsAttributes;
    }

    /**
     * Get all clients identifiers pickup objects list (object id list)
     * @returns The list of all currently picked up objects by clients
     */
    private getAllPickupObjects() : NetworkOwnedObjectsList[]{
        const pickupObjects : NetworkOwnedObjectsList[] = [];
        this._clients.forEach((client)=>{
            pickupObjects.push(new NetworkOwnedObjectsList(client.fixedAttributes.id,client.pickupNetworkObjects.map((pickupObject)=>{return pickupObject.spawnAttributes.id})));
        });
        this._bots.forEach((bot)=>{
            pickupObjects.push(new NetworkOwnedObjectsList(bot.fixedAttributes.id,bot.pickupNetworkObjects.map((pickupObject)=>{return pickupObject.spawnAttributes.id})));
        });
        return pickupObjects;
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
        this._bots.forEach((bot)=>{
            simulationStateStream.push(new NetworkPlayerGameStateStream(bot.fixedAttributes.id,bot.currentSimulationState));
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