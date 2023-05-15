import Position from "./position";

/**
 * A class that contains the information about hexagons owned by a player
 */
export default class NetworkOwnedHexagonList {
    /**
     * The id of the player
     */
    public id:number;
    /**
     * The list of hexagons owned by the player
     */
    public hexagonList:Position[];
    /**
     * Create a new instance of NetworkOwnedHexagonList
     * @param id The id of the player
     * @param hexagonList The list of hexagons owned by the player
     */
    public constructor(id:number, hexagonList:Position[]) {
        this.id = id;
        this.hexagonList = hexagonList;
    }
}