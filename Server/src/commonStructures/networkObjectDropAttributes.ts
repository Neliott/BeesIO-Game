import Position from "./position";

export default class NetworkObjectDropAttributes {
    public newPosition:Position;
    public objectID:number;
    constructor(newPosition:Position, objectID:number) {
        this.newPosition = newPosition;
        this.objectID = objectID;
    }
}