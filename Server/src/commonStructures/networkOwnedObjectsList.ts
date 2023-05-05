export default class NetworkOwnedObjectsList {
    public playerId:number;
    public ownedObjects:number[];
    constructor(playerId:number,ownedObjects:number[]) {
        this.playerId = playerId;
        this.ownedObjects = ownedObjects;
    }
}