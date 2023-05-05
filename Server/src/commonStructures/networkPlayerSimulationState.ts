import Position from "./position";

/**
 * The simulation state of a player. (Result of a input state)
 */
export default class NetworkPlayerSimulationState {
    /**
     * The simulation frame of the player.
     */
    public simulationFrame : number = 0;
    /**
     * The direction of the player.
     */
    public direction:number = 0;
    /** 
     * The position of the player.
     */
    public position : Position = new Position(0,0);
}