/**
 * This class is used to store the list of objects owned by a player.
 */
export default class NetworkOwnedObjectsList {
    /**
     * The id of the player.
     */
    public playerId:number;
    /**
     * The list of objects owned by the player.
     */
    public ownedObjects:number[];
    /**
     * The constructor for the NetworkOwnedObjectsList class.
     * @param playerId The id of the player.
     * @param ownedObjects The list of objects owned by the player.
     */
    constructor(playerId:number,ownedObjects:number[]) {
        this.playerId = playerId;
        this.ownedObjects = ownedObjects;
    }
}