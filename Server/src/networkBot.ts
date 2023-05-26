import Base from "./base";
import NetworkDropAttributes from "./commonStructures/networkDropAttributes";
import NetworkObjectDropAttributes from "./commonStructures/networkObjectDropAttributes";
import NetworkObjectType from "./commonStructures/networkObjectType";
import NetworkOwnedObjectsList from "./commonStructures/networkOwnedObjectsList";
import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";
import Position from "./commonStructures/position";
import Random from "./commonStructures/random";
import ServerEventType from "./commonStructures/serverEventType";
import iNetworkManager from "./iNetworkManager";
import iTarget from "./iTarget";
import NetworkManager from "./networkManager";
import NetworkPlayer from "./networkPlayer";
import Flower from "./objects/flower";
import NetworkObject from "./objects/networkObject";
import Pesticide from "./objects/pesticide";

/**
 * Represents a virtual player in the network but controlled by the server (no input is needed)
 */
export default class NetworkBot extends NetworkPlayer {
    private static readonly DROP_DISTANCE_TOLERANCE:number = .35;
    private static readonly NEAR_OBJECT_ERROR = 2;
    private static readonly BASE_PESTICIDE_RISK_RADIUS = 7;

    private _fixedSimulationStateIndex : number = 0;
    private _currentTarget:iTarget|null = null;
    private _passivity:number = 0;
    private _risk:number = 0;
    private _lastCachedBasePosition:Position|null = null;

    /**
     * Creates a new NetworkBot
     * @param networkManager The network manager used to communicate with the clients
     * @param fixedAttributes The fixed attributes of the bot
     */
    constructor(networkManager:iNetworkManager, fixedAttributes:NetworkPlayerFixedAttributes) {
        super(networkManager,fixedAttributes);
        this._passivity = Random.rangeFloat(0.3, 0.8);
        this._risk = Random.rangeFloat(0.3, 0.8);
    }

    protected override calculateCurrentSimulationState(): void {
        if(this.isNeedingANewTarget()){
            this.chooseNewTarget();
            if(this._currentTarget == null){
                console.log("No target found for this bot!");
                return;
            } 
        } 
        this._fixedSimulationStateIndex++;

        //The target position is not necesarry it's transform position (ex : a base has a closer valid point) 
        let targetWorldPosition = (this._currentTarget instanceof Base) ? this._lastCachedBasePosition! : this._currentTarget!.currentPosition;

        this.move(targetWorldPosition);
        this.checkTargetAccomplishement(targetWorldPosition);
        let pickedUpObject = this.tryToPickup();
        if(pickedUpObject != null)
            this._networkManager.sendGlobalMessage(ServerEventType.PICKUP,new NetworkOwnedObjectsList(this.fixedAttributes.id,[pickedUpObject.spawnAttributes.id]));
    }

    public override drop(): NetworkObject[] {
        let objectsDropped = super.drop();
        let objectsDroppedAttributes = objectsDropped.map((object)=>{
            return new NetworkObjectDropAttributes(object.spawnAttributes.position,object.spawnAttributes.id)
        });
        let dropAttributes = new NetworkDropAttributes(this.fixedAttributes.id,objectsDroppedAttributes);
        this._networkManager.sendGlobalMessage(ServerEventType.DROP,dropAttributes);
        return objectsDropped;
    }

    private move(targetWorldPosition: Position) {
        let targetRelativePosition = targetWorldPosition.clone();
        targetRelativePosition.subtract(this._currentPosition);

        let direction = Math.atan2(targetRelativePosition.y, targetRelativePosition.x) * (180/Math.PI);

        this._currentPosition.translate(direction,NetworkPlayer.SPEED*NetworkManager.TICK_INTERVAL);
        this.restrictPositionInsideMapBounds(this._currentPosition);
        this._currentSimulationState.position = this._currentPosition;
        this._currentSimulationState.direction = direction;
        this._currentSimulationState.simulationFrame = this._fixedSimulationStateIndex;
    }

    /**
     * Check if the target is reached and apply the action
     * @param targetWorldPosition The target real world position
     */
    private checkTargetAccomplishement(targetWorldPosition: Position) {
        let distanceFromTarget = Position.distance(this._currentPosition, targetWorldPosition);
        if (distanceFromTarget < NetworkBot.DROP_DISTANCE_TOLERANCE) {
            //Drop current objects if target is a base
            if (this._currentTarget instanceof Base && this._pickupNetworkObjects.length != 0) {
                this.drop();
            }

            this.chooseNewTarget();
        }
    }

    private isNeedingANewTarget():boolean
    {
        if (this._currentTarget == null) return true;

        //The target pickup object has a owner
        if (this._currentTarget instanceof NetworkObject && this._currentTarget.owner != null && this._currentTarget.owner != this) return true;

        //The flower target has no more pollen
        if (this._currentTarget instanceof Flower && this._currentTarget.hasPollen == false) return true;

        return false;
    }

    private chooseNewTarget()
    {
        let pickedUpObjects = this._pickupNetworkObjects;

        //Check if the base is in danger (take the pesticide out of base)
        let potentialDanger = this.pesticideEndangeringBase();
        if (potentialDanger != null)
        {
            this._currentTarget = potentialDanger;
            //Drop objects if they are not Pesticide
            if (pickedUpObjects.length > 0 && !(pickedUpObjects[0].spawnAttributes.type == NetworkObjectType.PESTICIDE)) this.drop();
            return;
        }

        //Get a random percentage to randomize next decisions
        let randomPercentage = Random.rangeFloat(0, 1);

        if (pickedUpObjects.length > 0)
        {
            //Calculate the risk for choosing what to do (with objects pickedup)
            if (randomPercentage > this._risk)
            {
                //Go to a base depending on the type of object
                if (pickedUpObjects[0].spawnAttributes.type == NetworkObjectType.POLLEN) this._currentTarget = this._base;
                if (pickedUpObjects[0].spawnAttributes.type == NetworkObjectType.PESTICIDE) this._currentTarget = this.getNearestOtherBase();
                
                //Using cached positions to not compute the NearestValidPlacablePosition at every frames
                if(this._currentTarget != null)
                    this._lastCachedBasePosition = (this._currentTarget as Base).getNearestValidPlacablePosition(this._currentPosition);
            }
            else
            {
                //Go to search more similar objects
                if (pickedUpObjects[0].spawnAttributes.type == NetworkObjectType.POLLEN)
                    this._currentTarget = this.getNearObject(NetworkObjectType.POLLEN);
                if (pickedUpObjects[0].spawnAttributes.type == NetworkObjectType.PESTICIDE)
                    this._currentTarget = this.getNearObject(NetworkObjectType.PESTICIDE);
            }
            return;
        }

        //Choose a new strategy
        if (randomPercentage > this._passivity)
        {
            //Find pollen in a flower
            this._currentTarget = this.getNearObject(NetworkObjectType.FLOWER);
            //If no compatible flowers found, go to single pollen units
            if (this._currentTarget == null) this.getNearObject(NetworkObjectType.POLLEN);
        }else{
            //Find pesticide
            this._currentTarget = this.getNearObject(NetworkObjectType.PESTICIDE);
        }
    }

    /**
     * Get the nearest base of an other player
     * @returns The nearest base found or null if no other player is found
     */
    private getNearestOtherBase():Base|null{
        let minDistance = Number.MAX_VALUE;
        let nearestBase:Base|null = null;
        for (let player of this._networkManager.clientsManager.getPlayersList()){
            if (player != this){
                let baseDistance = Position.distance(this._currentPosition, player.fixedAttributes.basePosition);
                if (baseDistance < minDistance){
                    minDistance = baseDistance;
                    nearestBase = player.base;
                }
            }
        }
        if(nearestBase == null){
            console.log("No other base found");
        }
        return nearestBase;
    }

    private pesticideEndangeringBase():Pesticide|null
    {
        let objectsTyped = this._networkManager.objectsManager.getSpawnedObjectsByType(NetworkObjectType.PESTICIDE);
        for (let i = 0; i < objectsTyped.length; i++) {
            let pesticideToTest = objectsTyped[i] as Pesticide;
            if(Position.distance(this._base.getNearestValidPlacablePosition(pesticideToTest.currentPosition), pesticideToTest.currentPosition) > NetworkBot.BASE_PESTICIDE_RISK_RADIUS) continue;
            if(pesticideToTest.owner != null) continue;
            return pesticideToTest;
        }
        return null;
    }

    /**
     * Get a object of a given type that is near (not necessary the nearest to randomise the behavior)
     * @param type The type of object targetted
     * @returns The object found or null if no matches
     */
    private getNearObject(type:NetworkObjectType):NetworkObject|null{
        //Get the list of objects by the distance
        let objectsByDistance = this._networkManager.objectsManager.getSpawnedObjectsByType(type).sort((a, b) => Position.distance(this._currentPosition, a.currentPosition) - Position.distance(this._currentPosition, b.currentPosition));

        //Start to search the object with a NEAR_OBJECT_ERROR index
        for (let i = Math.min(objectsByDistance.length, NetworkBot.NEAR_OBJECT_ERROR) - 1; i < objectsByDistance.length; i++) {
            //Determine if the object is compatible (no owner and interest)
            let objectToTest = objectsByDistance[i];
            if (objectToTest.owner != null) continue;
            if(objectToTest.spawnAttributes.type == NetworkObjectType.FLOWER && (objectToTest as Flower).hasPollen == false) continue;
            return objectToTest;
        }
        return null;
    }
}