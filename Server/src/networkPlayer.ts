import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "./commonStructures/networkPlayerInputState";
import Position from "./commonStructures/position";
import NetworkPlayerSimulationState from "./commonStructures/networkPlayerSimulationState";
import NetworkManager from "./networkManager";
import Base from "./base";
import HexaGrid from "./hexagrid";
import NetworkObject from "./objects/networkObject";
import iNetworkManager from "./iNetworkManager";

/**
 * Represents a player in the network
 */
class NetworkPlayer {
    /**
     * The speed of the player
     * ONLY PUBLIC FOR TESTING
     */
    public static SPEED : number = 6.5;

    private static readonly ZONE_EXCEEDING_TOLERANCE : number = 3;
    /**
     * The maximum distance from the center of the map the player can go
     * ONLY PUBLIC FOR TESTING
     */
    public static readonly MAX_X_POSITION : number= (((HexaGrid.MAP_SAFE_GRID_PERCENTAGE - 0.5) * HexaGrid.MAP_WIDTH) + NetworkPlayer.ZONE_EXCEEDING_TOLERANCE) * HexaGrid.SPACING_WIDTH;
    /**
     * The maximum distance from the center of the map the player can go
     * ONLY PUBLIC FOR TESTING
     */
    public static readonly MAX_Y_POSITION : number= (((HexaGrid.MAP_SAFE_GRID_PERCENTAGE - 0.5) * HexaGrid.MAP_HEIGHT) + NetworkPlayer.ZONE_EXCEEDING_TOLERANCE) * HexaGrid.SPACING_HEIGHT;

    private _lastSeen : number = 0;
    /**
     * Returns true if the client has been seen in the last CLIENT_TIMEOUT milliseconds
     */
    public get isEnabled() : boolean {
        return Date.now()-this._lastSeen < NetworkManager.CONNECTION_TIMEOUT;
    }

    private _fixedAttributes : NetworkPlayerFixedAttributes;
    /**
     * Returns the fixed attributes of the client
     */
    public get fixedAttributes() : NetworkPlayerFixedAttributes {
        return this._fixedAttributes;
    }
    
    private _currentSimulationState : NetworkPlayerSimulationState = new NetworkPlayerSimulationState(); 
    /**
     * Returns the current simulation state of the client
     */
    public get currentSimulationState() : NetworkPlayerSimulationState {
        return this._currentSimulationState;
    }

    private _pickupNetworkObjects : NetworkObject[] = [];
    /**
     * Get list of network objects picked up by this player
     */
    public get pickupNetworkObjects() : NetworkObject[] {
        return this._pickupNetworkObjects;
    }
    
    private _base! : Base;
    /**
     * Get the base of this player
    */
    public get base() : Base {
        return this._base;
    }

    private _inputStreamQueue : NetworkPlayerInputState[] = [];
    private _currentPosition : Position = new Position(0,0);

    /**
     * Creates a new NetworkPlayer
     * @param fixedAttributes The initial fixed attributes of the client
     */
    constructor(fixedAttributes:NetworkPlayerFixedAttributes) {
        this._fixedAttributes = fixedAttributes;
        //Copy the position cause it's a reference type
        this._currentPosition = new Position(fixedAttributes.basePosition.x,fixedAttributes.basePosition.y);
        this._currentSimulationState.position = fixedAttributes.basePosition;
        this.updateLastSeen();
    }

    /**
     * Create a new base for this player (call after the player has joined the game)
     * @param networkManager The network manager reference
     */
    public createBase(networkManager:iNetworkManager){
        this._base = new Base(networkManager,HexaGrid.wordPositionToHexIndexes(this.fixedAttributes.basePosition),this);
    }

    /**
     * Update the last time the client has been seen (to check if it's still connected)
     */
    public updateLastSeen() {
        this._lastSeen = Date.now();
    }

    /**
     * Update the state of the player (move it, etc.)
     */
    public networkTick() {
        this.processInputStreamQueue();
        if(this._pickupNetworkObjects.length > 0) this.updatePickedUpObjectsPosition();
        if(this._base != undefined)
            this._base.networkTick();
    }

    /**
     * Enqueue a new input stream to be processed on the next tick
     * @param inputStream The input stream to enqueue
     */
    public enqueueInputStream(inputStream:NetworkPlayerInputState) {
        this._inputStreamQueue.push(inputStream);
        this.updateLastSeen();
    }

    /**
     * Add a network object to the picked up list
     * @param networkObject The network object to pickup
     */
    public pickup(networkObject:NetworkObject) {
        networkObject.pickup(this);
        this._pickupNetworkObjects.push(networkObject);
    }

    /**
     * Drop all the network objects picked up by this player
     * @returns The list of network objects dropped
     */
    public drop():NetworkObject[]{
        let length = this._pickupNetworkObjects.length;//We need to store the length because the array will be modified
        for(let i = 0; i < length; i++) {
            this._pickupNetworkObjects[i-(length-this._pickupNetworkObjects.length)].drop();
        }
        let networkObjectsDroped = this._pickupNetworkObjects;
        this._pickupNetworkObjects = [];
        return networkObjectsDroped;
    }
    
    private dequeueInputStream() : NetworkPlayerInputState | undefined {
        return this._inputStreamQueue.shift();
    }
    
    private processInputStreamQueue() {
        let inputStream:NetworkPlayerInputState | undefined;
        while (this._inputStreamQueue.length > 0) {
            inputStream = this.dequeueInputStream();
            this._currentPosition.translate(inputStream!.direction,NetworkPlayer.SPEED*NetworkManager.TICK_INTERVAL);
            this.restrictPositionInsideMapBounds(this._currentPosition);
        }
        if(inputStream == undefined) return;
        this._currentSimulationState.position = this._currentPosition;
        this._currentSimulationState.direction = inputStream!.direction;
        this._currentSimulationState.simulationFrame = inputStream!.simulationFrame;
    }
    
    private restrictPositionInsideMapBounds(position:Position)
    {
        if (position.x > NetworkPlayer.MAX_X_POSITION)
        {
            position.x = NetworkPlayer.MAX_X_POSITION;
        }else if (position.x < -NetworkPlayer.MAX_X_POSITION)
        {
            position.x = -NetworkPlayer.MAX_X_POSITION;
        }

        if (position.y > NetworkPlayer.MAX_Y_POSITION)
        {
            position.y = NetworkPlayer.MAX_Y_POSITION;
        }else if (position.y < -NetworkPlayer.MAX_Y_POSITION)
        {
            position.y = -NetworkPlayer.MAX_Y_POSITION;
        }
    }

    private updatePickedUpObjectsPosition()
    {
        for(let i=0;i<this._pickupNetworkObjects.length;i++){
            if(i==0) this._pickupNetworkObjects[i].currentPosition = this.getNewPosition(this._currentPosition,this._pickupNetworkObjects[i].currentPosition);
            else this._pickupNetworkObjects[i].currentPosition = this.getNewPosition(this._pickupNetworkObjects[i-1].currentPosition,this._pickupNetworkObjects[i].currentPosition);
        }
    }

    /// <summary>
    /// Get a new position to follow the input
    /// </summary>
    /// <param name="input">The input (like a player or a previous node)</param>
    /// <param name="currentPosition">The current position</param>
    /// <returns>The new calculated position</returns>
    /// <remarks>Based on https://processing.org/examples/follow3.html </remarks>
    private getNewPosition(input:Position, currentPosition:Position):Position
    {
        let angleInRadians = Math.atan2(input.y-currentPosition.y, input.x-currentPosition.x);
        let newX = input.x - Math.cos(angleInRadians) * 1;
        let newY = input.y - Math.sin(angleInRadians) * 1;
        return new Position(newX, newY);
    }
}

export default NetworkPlayer;