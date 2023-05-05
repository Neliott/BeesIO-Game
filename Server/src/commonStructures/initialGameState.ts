import NetworkOwnedObjectsList from "./networkOwnedObjectsList";
import NetworkPlayerFixedAttributes from "./networkPlayerFixedAttributes";

export default class InitialGameState {
    public ownedClientID:number;
    public simulationStateStartIndex:number;
    public otherClientsInitialAttributes:NetworkPlayerFixedAttributes[];
    public objects:NetworkOwnedObjectsList[];
    public ownedObjects:NetworkOwnedObjectsList[];
    constructor(ownedClientID:number, simulationStateStartIndex:number, otherClientsInitialAttributes:NetworkPlayerFixedAttributes[], objects:NetworkOwnedObjectsList[], ownedObjects:NetworkOwnedObjectsList[]) {
        this.ownedClientID = ownedClientID;
        this.simulationStateStartIndex = simulationStateStartIndex;
        this.otherClientsInitialAttributes = otherClientsInitialAttributes;
        this.objects = objects;
        this.ownedObjects = ownedObjects;
    }
}