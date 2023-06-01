import HexaGrid from "../hexagrid";
import NetworkObject from "./networkObject";

/**
 * A pollen is an object that can be dropped on a base to upgrade it
 */
export default class Pollen extends NetworkObject{
    /**
     * Drop the pollen. If on a base, upgrade it by one level (one hexagon).
     */
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