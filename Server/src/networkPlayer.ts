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
     */
    private static SPEED : number = 6.5;

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

    private _inputStreamQueue : NetworkPlayerInputState[] = [];
    private _currentPosition : Position = new Position(0,0);

    /**
     * Creates a new NetworkPlayer
     * @param fixedAttributes The initial fixed attributes of the client
     */
    constructor(fixedAttributes:NetworkPlayerFixedAttributes) {
        this._fixedAttributes = fixedAttributes;
        this._currentPosition = fixedAttributes.basePosition;
        this._currentSimulationState.position = fixedAttributes.basePosition;
    }

    /**
     * Update the state of the player (move it, etc.)
     */
    public NetworkTick() {
        this.ProcessInputStreamQueue();
    }

    /**
     * Enqueue a new input stream to be processed on the next tick
     * @param inputStream The input stream to enqueue
     */
    public EnqueueInputStream(inputStream:NetworkPlayerInputState) {
        this._inputStreamQueue.push(inputStream);
    }
    
    private DequeueInputStream() : NetworkPlayerInputState | undefined {
        return this._inputStreamQueue.shift();
    }
    
    private ProcessInputStreamQueue() {
        let inputStream:NetworkPlayerInputState | undefined;
        while (this._inputStreamQueue.length > 0) {
            inputStream = this.DequeueInputStream();
            if(inputStream == undefined) continue;
            this._currentPosition.Translate(inputStream!.direction,NetworkPlayer.SPEED*NetworkManager.TICK_INTERVAL);
        }
        if(inputStream == undefined) return;
        this._currentSimulationState.position = this._currentPosition;
        this._currentSimulationState.direction = inputStream!.direction;
        this._currentSimulationState.simulationFrame = inputStream!.simulationFrame;
    }
}

export default NetworkPlayer;