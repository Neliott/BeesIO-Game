import Position from "./position";

/**
 * A class that contains the information about a hexagon property change
 */
export default class HexagonPropertyChanged {
    /**
     * The new owner of the hexagon
     */
    public newOwner:number;
    /**
     * The index (position) of the hexagon
     */
    public index:Position;
    /**
     * Create a new instance of HexagonPropertyChanged
     * @param newOwner The new owner of the hexagon
     * @param index The index (position) of the hexagon
     */
    public constructor(newOwner:number, index:Position) {
        this.newOwner = newOwner;
        this.index = index;
    }
}