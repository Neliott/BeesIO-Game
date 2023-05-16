import NetworkObjectSpawnAttributes from "./commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "./commonStructures/networkObjectType";
import Position from "./commonStructures/position";
import Random from "./commonStructures/random";
import ServerEventType from "./commonStructures/serverEventType";
import HexaGrid from "./hexagrid";
import NetworkManager from "./networkManager";
import NetworkObject from "./networkObject";

export default class NetworkObjectsManager {
    /**
     *  The target number of objects in the map
     */
    public static readonly TARGET_OBJECTS_AMOUNT:number = 75;
    /**
     * The number of flowers to spawn
     */
    public static readonly FLOWERS_AMOUNT:number = 15;
    /**
     *  Spawn objects every 1/rate seconds if needed
     */
    public static readonly SPAWN_OBJECTS_RATE:number = 1.5;

    private _networkManager:NetworkManager;
    private _objets:NetworkObject[] = [];
    private _clock:number = 0;
    private _nextId:number = 0;
    
    /**
     * The constructor of the class NetworkObjectsManager
     * @param networkManager The network manager reference
     */
    constructor(networkManager:NetworkManager) {
        this._networkManager = networkManager;
        this.startSpawningObject();
    }

    /**
     * Update the state of the network objects
     */
    public networkTick() {
        this._clock += NetworkManager.TICK_INTERVAL;
        if(this._clock >= NetworkObjectsManager.SPAWN_OBJECTS_RATE){
            this._clock = 0;
            if(this._objets.length < NetworkObjectsManager.TARGET_OBJECTS_AMOUNT){
                this.spawnRandomPickableObject();
            }
        }
    }

    /**
     * Get the nearest object of the given type
     * @param position The position to search in proximity
     * @param type The type of the object to search
     * @returns The nearest object of the given type
     */
    public getNearestObject(position:Position,type:NetworkObjectType):NetworkObject|null {
        let nearestObject:NetworkObject|null = null;
        let nearestDistance:number = Number.MAX_VALUE;
        for (let i = 0; i < this._objets.length; i++) {
            let object:NetworkObject = this._objets[i];
            if(object.spawnAttributes.type === type){
                let distance:number = Position.distance(object.currentPosition,position);
                if(distance < nearestDistance){
                    nearestDistance = distance;
                    nearestObject = object;
                }
            }
        }
        return nearestObject;
    }

    /**
     * Get the list of all the objects currently in the map
     * @returns The spawn attributes of all the objects currently in the map
     */
    public getAllObjectsSpawnAttributes():NetworkObjectSpawnAttributes[] {
        let spawnAttributes:NetworkObjectSpawnAttributes[] = [];
        for (let i = 0; i < this._objets.length; i++) {
            spawnAttributes.push(this._objets[i].spawnAttributes);
        }
        return spawnAttributes;
    }
    
    private startSpawningObject()
    {
        this._clock = 0;
        for (let i = 0; i < NetworkObjectsManager.TARGET_OBJECTS_AMOUNT; i++)
        {
            this.spawnRandomPickableObject();
        }
        for (let i = 0; i < NetworkObjectsManager.FLOWERS_AMOUNT; i++)
        {
            this.spawnObject(NetworkObjectType.FLOWER);
        }
    }

    private spawnRandomPickableObject(){
        this.spawnObject((Math.random() > 0.6)?NetworkObjectType.POLLEN:NetworkObjectType.PESTICIDE);
    }

    private spawnObject(type:NetworkObjectType) {
        let position:Position = HexaGrid.getRandomPlaceOnMap();
        let spawnAttributes:NetworkObjectSpawnAttributes = new NetworkObjectSpawnAttributes(this.getNextId(),type,position,0);
        let newObject:NetworkObject = new NetworkObject(spawnAttributes);
        this._objets.push(newObject);
        this._networkManager.sendGlobalMessage(ServerEventType.SPAWN,spawnAttributes);
    }
    
    /**
     * Get a unique id for a new object
     * @returns The next object id
     */
    private getNextId() : number {
        return this._nextId++;
    }
}