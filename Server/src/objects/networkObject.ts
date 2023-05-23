import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import Position from "../commonStructures/position";
import iNetworkManager from "../iNetworkManager";
import NetworkPlayer from "../networkPlayer";

export default class NetworkObject{
    private _spawnAttributes : NetworkObjectSpawnAttributes;
    /**
     * Get the spawn attributes of the object
     */
    public get spawnAttributes() : NetworkObjectSpawnAttributes {
        return this._spawnAttributes;
    }
    
    private _currentPosition : Position;
    /**
     * Get the current position of the object
     */
    public get currentPosition() : Position {
        return this._currentPosition;
    }
    /**
     * Set the current position of the object
     */
    public set currentPosition(v : Position) {
        this._currentPosition = v;
    }

    protected _owner : NetworkPlayer|null = null;
    protected _networkManager:iNetworkManager;

    /**
     * Get if the object is currently picked up
     */
    public get isPickedUp() : boolean {
        return this._owner !== null;
    }

    private _hasAlreadyMoved : boolean = false;

    /**
     * Get if the object has already moved in the map at least once
     */
    public get hasAlreadyMoved() : boolean {
        return this._hasAlreadyMoved;
    }
    
    
    /**
     * Creates a new NetworkObject
     * @param networkManager The network manager used to communicate with the clients
     * @param spawnAttributes The spawn attributes of the object
     */
    constructor(networkManager:iNetworkManager,spawnAttributes:NetworkObjectSpawnAttributes) {
        this._networkManager = networkManager;
        this._spawnAttributes = spawnAttributes;
        this._currentPosition = spawnAttributes.position;
    }

    /**
     * Update the state of the network object
     */
    public networkTick() {}

    /**
     * Called when the object is picked up
     */
    public pickup(owner:NetworkPlayer){
        this._owner = owner;
        this._hasAlreadyMoved = true;
    }

    /**
     * Called when the object is drop
     */
    public drop(){
        this._owner = null;
        this._spawnAttributes.position = this._currentPosition;
    }
}