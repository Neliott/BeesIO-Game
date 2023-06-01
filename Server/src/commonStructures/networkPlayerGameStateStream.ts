import NetworkPlayerSimulationState from "./networkPlayerSimulationState";

/**
 * The game state of a player. (Result of a simulation state)
 */
export default class NetworkPlayerGameStateStream {
    /**
     * The id of the player.
     */
    public id:number;
    /**
     * The simulation state of the player.
     */
    public simulationState:NetworkPlayerSimulationState;
    /**
     * The constructor for the NetworkPlayerGameStateStream class.
     * @param id The id of the player.
     * @param simulationState The simulation state of the player.
     */
    constructor(id:number,simulationState:NetworkPlayerSimulationState) {
        this.id = id;
        this.simulationState = simulationState;
    }
}