import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import Position from "../commonStructures/position";

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

    private _isPickedUp : boolean = false;

    /**
     * Get if the object is currently picked up
     */
    public get isPickedUp() : boolean {
        return this._isPickedUp;
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
     * @param spawnAttributes The spawn attributes of the object
     */
    constructor(spawnAttributes:NetworkObjectSpawnAttributes) {
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
    public pickup(){
        console.log("Picked up "+this._spawnAttributes.id);
        this._isPickedUp = true;
        this._hasAlreadyMoved = true;
    }

    /**
     * Called when the object is drop
     */
    public drop(){
        console.log("Drop "+this._spawnAttributes.id);
        this._isPickedUp = false;
    }
}