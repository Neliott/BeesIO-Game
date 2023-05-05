import Position from "./position";

export default class NetworkPlayerSimulationState {
    public simulationFrame : number = 0;
    public direction:number = 0;
    public position : Position = new Position(0,0);
}