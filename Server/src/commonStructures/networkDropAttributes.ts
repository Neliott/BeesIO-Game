import NetworkObjectDropAttributes from "./NetworkObjectDropAttributes";

export default class NetworkDropAttributes {
    public playerId:number;
    public objectsDropped:NetworkObjectDropAttributes[];
    constructor(playerId:number, objectsDropped:NetworkObjectDropAttributes[]) {
        this.playerId = playerId;
        this.objectsDropped = objectsDropped;
    }
}