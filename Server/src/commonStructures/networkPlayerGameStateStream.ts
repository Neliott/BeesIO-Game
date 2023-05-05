import NetworkPlayerSimulationState from "./networkPlayerSimulationState";

export default class NetworkPlayerGameStateStream {
    constructor(id:number,simulationState:NetworkPlayerSimulationState) {
        this.id = id;
        this.simulationState = simulationState;
    }
    public id:number;
    public simulationState:NetworkPlayerSimulationState;
}