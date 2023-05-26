import Base from "./base";
import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "./commonStructures/networkPlayerInputState";
import NetworkPlayerSimulationState from "./commonStructures/networkPlayerSimulationState";
import Random from "./commonStructures/random";
import iNetworkManager from "./iNetworkManager";
import iTarget from "./iTarget";
import NetworkManager from "./networkManager";
import NetworkPlayer from "./networkPlayer";
import Flower from "./objects/flower";
import NetworkObject from "./objects/networkObject";

/**
 * Represents a virtual player in the network but controlled by the server (no input is needed)
 */
export default class NetworkBot extends NetworkPlayer {
    private static readonly DROP_DISTANCE_TOLERANCE:number = .35;
    private static readonly NEAR_OBJECT_ERROR = 2;
    private static readonly BASE_PESTICIDE_RISK_RADIUS = 7;

    private _networkManager:iNetworkManager;
    private _fixedSimulationStateIndex : number = 0;
    private _currentTarget:iTarget|null = null;
    private _passivity:number = 0;
    private _risk:number = 0;

    /**
     * Creates a new NetworkBot
     * @param networkManager The network manager used to communicate with the clients
     * @param fixedAttributes The fixed attributes of the bot
     */
    constructor(networkManager:iNetworkManager, fixedAttributes:NetworkPlayerFixedAttributes) {
        super(fixedAttributes);
        this._networkManager = networkManager;
        this._passivity = Random.range(0.3, 0.8);
        this._risk = Random.range(0.3, 0.8);
    }

    protected override calculateCurrentSimulationState(): void {
        this._fixedSimulationStateIndex++;
        let direction = 0;
        this._currentPosition.translate(direction,NetworkPlayer.SPEED*NetworkManager.TICK_INTERVAL);
        this.restrictPositionInsideMapBounds(this._currentPosition);
        this._currentSimulationState.position = this._currentPosition;
        this._currentSimulationState.direction = direction;
        this._currentSimulationState.simulationFrame = this._fixedSimulationStateIndex;
    }

    private isNeedingANewTarget():boolean
    {
        if (this._currentTarget == null) return true;

        //The target pickup object has a owner
        let netObject = this._currentTarget as NetworkObject;
        if (netObject && netObject.owner != null && netObject.owner != this) return true;

        //The flower target has no more pollen
        let flower = this._currentTarget as Flower;
        if (flower && flower.hasPollen == false) return true;

        return false;
    }
}