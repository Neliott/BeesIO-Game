import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "./commonStructures/networkPlayerInputState";
import Position from "./commonStructures/position";
import NetworkPlayerSimulationState from "./commonStructures/networkPlayerSimulationState";
import NetworkManager from "./networkManager";

/**
 * Represents a player in the network
 */
class NetworkPlayer {
    /**
     * The speed of the player
     * ONLY PUBLIC FOR TESTING
     */
    public static SPEED : number = 6.5;

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
    
    private _isAppearingOffline : boolean = false;
    /**
     * Is the client appearing offline (has left from the client perspective)
    */
    public get isAppearingOffline() : boolean {
        return this._isAppearingOffline;
    }
    /**
     * Set the client to appear offline (has left from the client perspective)
     */
    public set isAppearingOffline(value : boolean) {
        this._isAppearingOffline = value;
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
     * Update the last time the client has been seen (to check if it's still connected)
     */
    public updateLastSeen() {
        this._lastSeen = Date.now();
        this.isAppearingOffline = false;
    }

    /**
     * Update the state of the player (move it, etc.)
     */
    public networkTick() {
        this.processInputStreamQueue();
    }

    /**
     * Enqueue a new input stream to be processed on the next tick
     * @param inputStream The input stream to enqueue
     */
    public enqueueInputStream(inputStream:NetworkPlayerInputState) {
        this._inputStreamQueue.push(inputStream);
        this.updateLastSeen();
    }
    
    private dequeueInputStream() : NetworkPlayerInputState | undefined {
        return this._inputStreamQueue.shift();
    }
    
    private processInputStreamQueue() {
        let inputStream:NetworkPlayerInputState | undefined;
        while (this._inputStreamQueue.length > 0) {
            inputStream = this.dequeueInputStream();
            this._currentPosition.translate(inputStream!.direction,NetworkPlayer.SPEED*NetworkManager.TICK_INTERVAL);
        }
        if(inputStream == undefined) return;
        this._currentSimulationState.position = this._currentPosition;
        this._currentSimulationState.direction = inputStream!.direction;
        this._currentSimulationState.simulationFrame = inputStream!.simulationFrame;
    }
}

export default NetworkPlayer;