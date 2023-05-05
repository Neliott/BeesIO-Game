export default class NetworkPlayerInputState {
    public simulationFrame:number;
    public direction:number;

    constructor(simulationFrame:number, direction:number) {
        this.simulationFrame = simulationFrame;
        this.direction = direction;
    }
}