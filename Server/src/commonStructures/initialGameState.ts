import NetworkOwnedObjectsList from "./networkOwnedObjectsList";
import NetworkPlayerFixedAttributes from "./networkPlayerFixedAttributes";

/**
 * This class is used to store the initial state of the game to be sent to a client.
 */
export default class InitialGameState {
    /**
     * The id of the client that owns this state.
     */
    public ownedClientID:number;
    /**
     * The index of the simulation state that the client should start at.
     */
    public simulationStateStartIndex:number;
    /**
     * The initial attributes of the other clients.
     */
    public otherClientsInitialAttributes:NetworkPlayerFixedAttributes[];
    /**
     * The list of objects in the game.
     */
    public objects:NetworkOwnedObjectsList[];
    /**
     * The list of objects owned by the client.
     */
    public ownedObjects:NetworkOwnedObjectsList[];
    /**
     * The constructor for the InitialGameState class.
     * @param ownedClientID The id of the client that owns this state.
     * @param simulationStateStartIndex The index of the simulation state that the client should start at.
     * @param otherClientsInitialAttributes The initial attributes of the other clients.
     * @param objects The list of objects in the game.
     * @param ownedObjects The list of objects owned by the client.
     */
    constructor(ownedClientID:number, simulationStateStartIndex:number, otherClientsInitialAttributes:NetworkPlayerFixedAttributes[], objects:NetworkOwnedObjectsList[], ownedObjects:NetworkOwnedObjectsList[]) {
        this.ownedClientID = ownedClientID;
        this.simulationStateStartIndex = simulationStateStartIndex;
        this.otherClientsInitialAttributes = otherClientsInitialAttributes;
        this.objects = objects;
        this.ownedObjects = ownedObjects;
    }
}