/**
 * The input state of a player to be sent over the network. Used to compute the simulation state.
 */
export default class NetworkPlayerInputState {
    /**
     * The simulation frame that this input state is for.
     */
    public simulationFrame:number;
    /**
     * The direction that the player is facing.
     */
    public direction:number;

    /**
     * The constructor for the NetworkPlayerInputState class.
     * @param simulationFrame The simulation frame that this input state is for.
     * @param direction The direction that the player is facing.
     */
    constructor(simulationFrame:number, direction:number) {
        this.simulationFrame = simulationFrame;
        this.direction = direction;
    }
}