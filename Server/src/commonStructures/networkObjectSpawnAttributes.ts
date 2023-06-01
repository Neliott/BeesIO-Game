import NetworkObjectType from "./networkObjectType";
import Position from "./position";

/**
 * Used to inform the client that a new object has been spawned.
 */
export default class NetworkObjectSpawnAttributes {
    /**
     * The id of the object that is being spawned.
     */
    public id : number;
    /**
     * The type of the object that is being spawned.
     */
    public type : NetworkObjectType;
    /**
     * The position of the object that is being spawned.
     */
    public position : Position;
    /**
     * The direction of the object that is being spawned.
     */
    public direction : number;
    /**
     * The scale of the object that is being spawned.
     */
    public scale : number;
    
    /**
     * The constructor for the NetworkObjectSpawnAttributes class.
     * @param id The id of the object that is being spawned.
     * @param type The type of the object that is being spawned.
     * @param position The position of the object that is being spawned.
     * @param direction The direction of the object that is being spawned.
     * @param scale The scale of the object that is being spawned.
     */
    constructor(id:number,type:NetworkObjectType,position:Position,direction:number,scale:number=1) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.direction = direction;
        this.scale = scale;
    }
}