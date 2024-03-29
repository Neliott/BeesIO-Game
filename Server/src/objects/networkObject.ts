import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import Position from "../commonStructures/position";
import iNetworkManager from "../iNetworkManager";
import iTarget from "../iTarget";
import NetworkPlayer from "../players/networkPlayer";

/**
 * Represents an object serialized in the network environnement 
 * that can be picked up and drop by a player
 */
export default class NetworkObject implements iTarget{
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

    /**
     * Get if the current owner of the object or null if the object is not owned
     */
    public get owner() : NetworkPlayer|null {
        return this._owner;
    }

    private _hasAlreadyMoved : boolean = false;

    /**
     * Get if the object has already moved in the map at least once
     */
    public get hasAlreadyMoved() : boolean {
        return this._hasAlreadyMoved;
    }

    /**
     * Get the owner of the object or null if the object is not owned
     */
    protected _owner : NetworkPlayer|null = null;
    
    /**
     * Get the network manager used to communicate with the clients
     */
    protected _networkManager:iNetworkManager;
    
    
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

    /**
     * Called when the object is destroyed. 
     * This will remove the object from the all the known lists
     */
    protected destroy(){
        this._networkManager.objectsManager.applyDestroyObject(this);
        if(this._owner !== null){
            this._owner.pickupNetworkObjects.splice(this._owner.pickupNetworkObjects.indexOf(this),1);
        }
    }
}