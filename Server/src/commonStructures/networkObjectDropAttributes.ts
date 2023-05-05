import Position from "./position";

/**
 * The informations about a dropped object
 */
export default class NetworkObjectDropAttributes {
    /**
     * The new position of the object.
     */
    public newPosition:Position;
    /**
     * The id of the object.
     */
    public objectID:number;
    /**
     * The constructor for the NetworkObjectDropAttributes class.
     * @param newPosition The new position of the object.
     * @param objectID The id of the object.
     */
    constructor(newPosition:Position, objectID:number) {
        this.newPosition = newPosition;
        this.objectID = objectID;
    }
}