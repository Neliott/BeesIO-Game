import NetworkObjectDropAttributes from "./NetworkObjectDropAttributes";

/**
 * Used to send the informations about the objects dropped by a player.
 */
export default class NetworkDropAttributes {
    /**
     * The id of the player.
     */
    public playerId:number;
    /**
     * The list of objects dropped by the player.
     */
    public objectsDropped:NetworkObjectDropAttributes[];
    /**
     * The constructor for the NetworkDropAttributes class.
     * @param playerId The id of the player.
     * @param objectsDropped The list of objects dropped by the player.
     */
    constructor(playerId:number, objectsDropped:NetworkObjectDropAttributes[]) {
        this.playerId = playerId;
        this.objectsDropped = objectsDropped;
    }
}