import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "../commonStructures/networkObjectType";
import Random from "../commonStructures/random";
import ServerEventType from "../commonStructures/serverEventType";
import HexaGrid from "../hexagrid";
import NetworkObject from "./networkObject";

/**
 * A pesticide is an object that can destroy all the pollen in a radius
 * after a certain amount of time
 */
export default class Pesticide extends NetworkObject{
    private static readonly MINIMUM_RADIUS:number = 2;
    private static readonly MAXIMUM_RADIUS:number = 4;
    private static readonly SECONDS_BEFORE_EXPLOSION:number = 10;

    private _timeout:NodeJS.Timeout|null = null;

    /**
     * Drop the pesticide and start the countdown
     */
    public override drop(): void {
        super.drop();
        if(this._timeout != null) return;
        this._timeout = setTimeout(()=>{
            this.explode()
        }, Pesticide.SECONDS_BEFORE_EXPLOSION*1000);
    }

    /**
     * Destroy the pesticide and explode (destroy all the pollen in a radius)
     */
    private explode()
    {
        let center = HexaGrid.wordPositionToHexIndexes(this.currentPosition);
        let radius = Random.rangeInt(Pesticide.MINIMUM_RADIUS-0.4, Pesticide.MAXIMUM_RADIUS);
        let allHexsToExplode = HexaGrid.getBigHexagonPositions(center, radius, false);
        for (let i = 0; i < allHexsToExplode.length; i++) {
            this._networkManager.hexaGrid.setHexagonProperty(allHexsToExplode[i], null);
        }
        this._networkManager.sendGlobalMessage(ServerEventType.SPAWN_UNMANAGED, new NetworkObjectSpawnAttributes(-1,NetworkObjectType.EXPLOSION,this.currentPosition,0,radius * 1.5));
        super.destroy();
    }
}