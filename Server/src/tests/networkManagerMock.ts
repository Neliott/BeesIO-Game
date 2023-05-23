import ServerEventType from "../commonStructures/serverEventType";
import HexaGrid from "../hexagrid";
import iNetworkManager from "../iNetworkManager";
import iWebSocketClientSend from "../iWebSocketClientSend";
import NetworkPlayersManager from "../networkPlayersManager";
import NetworkObjectsManager from "../objects/networkObjectsManager";

/**
 * This manager is used to mock the NetworkManager functions for the tests. It can be used to pass this into other objects that need a NetworkManager during the tests
 */
export default class NetworkManagerMock implements iNetworkManager {

    private _globalMessageHistory : ServerEventType[] = [];
    public get globalMessageHistory() : ServerEventType[] {
        return this._globalMessageHistory;
    }

    private _privateMessageHistory : ServerEventType[] = [];
    public get privateMessageHistory() : ServerEventType[] {
        return this._globalMessageHistory;
    }
    

    private _clientsManager : NetworkPlayersManager;

    /**
     * Returns the clients manager
     */
    public get clientsManager() : NetworkPlayersManager {
        return this._clientsManager;
    }

    private _objectsManager : NetworkObjectsManager;

    /**
     * Returns the objects manager
     */
    public get objectsManager() : NetworkObjectsManager {
        return this._objectsManager;
    }

    private _hexaGrid : HexaGrid;

    /**
     * Returns the hexagrid
     */
    public get hexaGrid() : HexaGrid {
        return this._hexaGrid;
    }

    /**
     * Creates a new NetworkManager (new room with services)
     */
    constructor() {
        this._clientsManager = new NetworkPlayersManager(this);
        this._hexaGrid = new HexaGrid(this);
        this._objectsManager = new NetworkObjectsManager(this);
    }

    /**
     * Sends a message to the target
     * @param target The websocket of the target
     * @param type The type of the message
     * @param data The additional data of the message
     */
    public sendMessage(target:iWebSocketClientSend,type:ServerEventType,data:any){
        this._privateMessageHistory.push(type);
    }

    /**
     * Sends a message to all the connected clients
     * @param type The type of the message
     * @param data The additional data of the message
     */
    public sendGlobalMessage(type:ServerEventType,data:any){
        this._globalMessageHistory.push(type);
    }

    /**
     * Deserializes the message and calls the appropriate function
     */
    public onMessage(sender:iWebSocketClientSend,message:string) {

    }

    /**
     * Removes the client from the list of connected clients
     * @param sender The websocket of the client disconnected
     */
    public onClose(sender:iWebSocketClientSend) {

    }
}