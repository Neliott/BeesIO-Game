import HexagonPropertyChanged from "./commonStructures/hexagonPropertyChanged";
import ServerEventType from "./commonStructures/serverEventType";
import HexaGrid from "./hexagrid";
import iWebSocketClientSend from "./iWebSocketClientSend";
import NetworkPlayersManager from "./networkPlayersManager";
import NetworkObjectsManager from "./objects/networkObjectsManager";

/**
 * This interface is used to describe methods for managing the network (serialize the game state, send it to the clients, receive the inputs, etc.) and the different services managing the game state
 */
export default interface iNetworkManager {

    /**
     * Returns the clients manager
     */
    get clientsManager() : NetworkPlayersManager;

    /**
     * Returns the objects manager
     */
    get objectsManager() : NetworkObjectsManager;

    /**
     * Returns the hexagrid
     */
    get hexaGrid() : HexaGrid;

    /**
     * Sends a message to the target
     * @param target The websocket of the target
     * @param type The type of the message
     * @param data The additional data of the message
     */
    sendMessage(target:iWebSocketClientSend,type:ServerEventType,data:any) : void;

    /**
     * Sends a message to all the connected clients
     * @param type The type of the message
     * @param data The additional data of the message
     */
    sendGlobalMessage(type:ServerEventType,data:any) : void;

    /**
     * Deserializes the message and calls the appropriate function
     */
    onMessage(sender:iWebSocketClientSend,message:string) : void;

    /**
     * Removes the client from the list of connected clients
     * @param sender The websocket of the client disconnected
     */
    onClose(sender:iWebSocketClientSend) : void;
}