import { EventEmitter } from "events";
import Position from "./commonStructures/position";
import HexaGrid from "./hexagrid";
import NetworkManager from "./networkManager";
import NetworkPlayer from "./networkPlayer";

/**
 * Represents a base with hexagons that can be upgraded
 */
export default class Base{
    private static readonly DEFAULT_BASE_SIZE = 2;

    /**
     * Events emitter (only emitt 'destroyed' when the base has no remaning hexagons)
     */
    public eventEmitter = new EventEmitter()
    /**
     * Get the owner of the base
     */
    public get owner():NetworkPlayer { return this._owner; }

    private _isDestroyed:boolean = false;
    private _upgradesToApply:number = 0;
    private _baseLevel:number;
    private _baseCenterIndex : Position;
    private _remaningHexagonsForNextStep:Position[] = [];
    private _currentHexagones:Position[] = [];
    private _networkManager:NetworkManager;
    private _owner:NetworkPlayer;

    /**
     * Create a new base
     * @param networkManager The network manager
     * @param centerIndex The center of the base
     * @param owner The owner of the base
     */
    constructor(networkManager:NetworkManager,centerIndex:Position,owner:NetworkPlayer){
        this._owner = owner;
        this._networkManager = networkManager;
        this._baseCenterIndex = centerIndex;
        this._baseLevel = Base.DEFAULT_BASE_SIZE;
        this.fillBase(Base.DEFAULT_BASE_SIZE);
    }

    /**
     * Try to build the next hexagon of the base
     */
    public networkTick()
    {
        this._networkManager.hexaGrid.setHexagonProperty(HexaGrid.wordPositionToHexIndexes(this.owner.currentSimulationState.position),this);
        if (this._upgradesToApply == 0 || this._isDestroyed) return;
        this._upgradesToApply--;
        this.buildNextBaseHexagon();
    }

    /**
     * Get the nearest valid position to place a new hexagon on the base
     * @param position The target position
     * @returns The nearest valid position
     */
    public getNearestValidPlacablePosition(position:Position):Position
    {
        let minDistance = Number.MAX_SAFE_INTEGER;
        let nearestPosition = new Position(0,0);
        this._currentHexagones.forEach((hexagon)=>{
            let hexagonPosition = HexaGrid.hexIndexesToWorldPosition(hexagon);
            let distance = Position.distance(position, hexagonPosition);
            if (distance < minDistance)
            {
                minDistance = distance;
                nearestPosition = hexagonPosition;
            }
        });
        return nearestPosition;
    }

    /**
     * Upgrade the base with a amount of points
     * @param points The number of new hexagons to add to the base
     */
    public upgrade(points:number)
    {
        this._upgradesToApply = this._upgradesToApply + points;
    }
    
    /**
     * Make checks when the list of owned hexagones changes
     */
    public onHexagonOwnedListChanged()
    {
        let hexagons = this._networkManager.hexaGrid.getHexagonsOfBase(this)!;
        let difference = this._currentHexagones.filter(x => !hexagons.includes(x));
        this._remaningHexagonsForNextStep.unshift(...difference);
        this._currentHexagones = hexagons;
        if (this._currentHexagones.length == 0 && !this._isDestroyed) {
            this.eventEmitter.emit('destroyed');
            this._isDestroyed = true;
        }
    }

    private buildNextBaseHexagon()
    {
        if(this._isDestroyed) return;
        if (this._remaningHexagonsForNextStep.length == 0)
        {
            this._baseLevel++;
            this._remaningHexagonsForNextStep = HexaGrid.getBigHexagonPositions(this._baseCenterIndex, this._baseLevel, true);
        }
        this._networkManager.hexaGrid.setHexagonProperty(this._remaningHexagonsForNextStep[0], this);
        this._remaningHexagonsForNextStep.splice(0,1);
    }

    private fillBase(radius:number)
    {
        if(this._isDestroyed) return;
        const basePosition = HexaGrid.getBigHexagonPositions(this._baseCenterIndex, radius, false);
        basePosition.forEach((position)=>{
            this._networkManager.hexaGrid.setHexagonProperty(position, this);
        });
    }
}