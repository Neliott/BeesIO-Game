import HexaGrid from "../hexagrid";
import NetworkObject from "./networkObject";

export default class Pollen extends NetworkObject{
    public override drop(): void {
        let indexes = HexaGrid.wordPositionToHexIndexes(this._owner!.currentSimulationState.position);
        let baseOn = this._networkManager.hexaGrid.getPropertyOfHexIndex(indexes);
        if(baseOn != null){
            baseOn.upgrade(1);
            super.destroy();
        }
        super.drop();
    }
}