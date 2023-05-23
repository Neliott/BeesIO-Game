import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "../commonStructures/networkObjectType";
import Position from "../commonStructures/position";
import ServerEventType from "../commonStructures/serverEventType";
import HexaGrid from "../hexagrid";
import iNetworkManager from "../iNetworkManager";
import NetworkManager from "../networkManager";
import Flower from "./flower";
import NetworkObject from "./networkObject";
import Pesticide from "./pesticide";
import Pollen from "./pollen";

export default class NetworkObjectsManager {
    /**
     *  The target number of objects in the map
     */
    public static TARGET_OBJECTS_AMOUNT:number = 75;
    /**
     * The number of flowers to spawn
     */
    public static FLOWERS_AMOUNT:number = 15;
    /**
     *  Spawn objects every interval
     */
    public static SPAWN_OBJECTS_INTERVAL:number = 1.5;

    private _networkManager:iNetworkManager;
    private _objets:NetworkObject[] = [];
    private _clock:number = 0;
    private _nextId:number = 0;
    
    /**
     * The constructor of the class NetworkObjectsManager
     * @param networkManager The network manager reference
     */
    constructor(networkManager:iNetworkManager) {
        this._networkManager = networkManager;
        this.startSpawningObject();
    }

    /**
     * Update the state of the network objects
     */
    public networkTick() {
        for (let i = 0; i < this._objets.length; i++) {
            this._objets[i].networkTick();
        }
        this._clock += NetworkManager.TICK_INTERVAL;
        if(this._clock >= NetworkObjectsManager.SPAWN_OBJECTS_INTERVAL){
            this._clock = 0;
            if(this._objets.length < NetworkObjectsManager.TARGET_OBJECTS_AMOUNT){
                this.spawnRandomPickableObject();
            }
        }
    }

    /**
     * Get the nearest object of the given type
     * @param position The position to search in proximity
     * @param types The types of the objects to search (accepted types)
     * @param acceptPickedUp Dont take into account the picked up objects
     * @returns The nearest object of the given type
     */
    public getNearestObject(position:Position,types:NetworkObjectType[],acceptPickedUp:boolean):NetworkObject|null {
        let nearestObject:NetworkObject|null = null;
        let nearestDistance:number = Number.MAX_VALUE;
        for (let i = 0; i < this._objets.length; i++) {
            let object:NetworkObject = this._objets[i];
            types.forEach(type => {
                if(object.spawnAttributes.type === type){
                    let distance:number = Position.distance(object.currentPosition,position);
                    console.log(object.spawnAttributes.id+" "+object.isPickedUp+" "+acceptPickedUp+" "+distance+" "+nearestDistance);
                    if(distance < nearestDistance && (acceptPickedUp || !object.isPickedUp)){ 
                        console.log("New nearest object found : "+object.spawnAttributes.type+" "+distance);
                        nearestDistance = distance;
                        nearestObject = object;
                    }
                }
            });
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

    /**
     * Spawn a NetworkObject on the map
     * @param type The type of the object to spawn
     * @param position The position of the object to spawn
     * @returns 
     */
    public spawnObject(type:NetworkObjectType,position:Position, rotation:number):NetworkObject {
        let spawnAttributes:NetworkObjectSpawnAttributes = new NetworkObjectSpawnAttributes(this.getNextId(),type,position,rotation);
        let newObject:NetworkObject;
        switch(type){
            case NetworkObjectType.POLLEN:
                newObject = new Pollen(this._networkManager,spawnAttributes);
                break;
            case NetworkObjectType.PESTICIDE:
                newObject = new Pesticide(this._networkManager,spawnAttributes);
                break;
            case NetworkObjectType.FLOWER:
                newObject = new Flower(this._networkManager,spawnAttributes);
                break;
            default:
                newObject = new NetworkObject(this._networkManager,spawnAttributes);
                break;
        }
        this._objets.push(newObject);
        this._networkManager.sendGlobalMessage(ServerEventType.SPAWN,spawnAttributes);
        return newObject;
    }

    /**
     * Spawn a unmanaged object on the map
     * @param type The type of the object to spawn
     * @param position The position of the object to spawn
     * @param rotation The rotation of the object to spawn
     */
    public spawnParticule(type:NetworkObjectType,position:Position, rotation:number) {
        let spawnAttributes:NetworkObjectSpawnAttributes = new NetworkObjectSpawnAttributes(-1,type,position,rotation);
        this._networkManager.sendGlobalMessage(ServerEventType.SPAWN_UNMANAGED,spawnAttributes);
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
            this.spawnObject(NetworkObjectType.FLOWER,HexaGrid.getRandomPlaceOnMap(),0);
        }
    }

    private spawnRandomPickableObject(){
        this.spawnObject((Math.random() > 0.6)?NetworkObjectType.POLLEN:NetworkObjectType.PESTICIDE,HexaGrid.getRandomPlaceOnMap(),0);
    }
    
    /**
     * Get a unique id for a new object
     * @returns The next object id
     */
    private getNextId() : number {
        return this._nextId++;
    }
}