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
    public static SPAWN_OBJECTS_INTERVAL:number = 0.4;

    /**
     * The pesticide drop rate (the rest is pollen) when spawning a random pickable object
     */
    private static PESTICIDE_SPAWN_RATE = 0.8;

    private _networkManager:iNetworkManager;
    private _objets:NetworkObject[] = [];
    private _additionnalObjets:NetworkObject[] = [];
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
        let allObjectsArray:NetworkObject[] = this._objets.concat(this._additionnalObjets);
        for (let i = 0; i < allObjectsArray.length; i++) {
            allObjectsArray[i].networkTick();
        }
        this._clock += NetworkManager.TICK_INTERVAL;
        if(this._clock >= NetworkObjectsManager.SPAWN_OBJECTS_INTERVAL){
            this._clock = 0;
            if(this._objets.length-NetworkObjectsManager.FLOWERS_AMOUNT < NetworkObjectsManager.TARGET_OBJECTS_AMOUNT){
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
        let allObjectsArray:NetworkObject[] = this._objets.concat(this._additionnalObjets);
        for (let i = 0; i < allObjectsArray.length; i++) {
            let object:NetworkObject = allObjectsArray[i];
            types.forEach(type => {
                if(object.spawnAttributes.type === type){
                    let distance:number = Position.distance(object.currentPosition,position);
                    if(distance < nearestDistance && (acceptPickedUp || object.owner == null)){ 
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
        let allObjectsArray:NetworkObject[] = this._objets.concat(this._additionnalObjets);
        for (let i = 0; i < allObjectsArray.length; i++) {
            spawnAttributes.push(allObjectsArray[i].spawnAttributes);
        }
        return spawnAttributes;
    }

    /**
     * Spawn a NetworkObject on the map
     * @param type The type of the object to spawn
     * @param position The position of the object to spawn
     * @param rotation The rotation of the object to spawn
     * @param isAdditionnal If the object is additionnal (like in a flower) and will not count in the total amount of objects
     * @returns The spawned object
     */
    public spawnObject(type:NetworkObjectType,position:Position, rotation:number, isAdditionnal:boolean=true):NetworkObject {
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
        isAdditionnal ? this._additionnalObjets.push(newObject) : this._objets.push(newObject);;
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

    /**
     * Get all the objects currently in the map by type
     * @param type The type of the objects to get
     * @returns The list of all the objects currently in the map by type
     */
    public getSpawnedObjectsByType(type:NetworkObjectType):NetworkObject[]{
        let objects:NetworkObject[] = [];
        let allObjectsArray:NetworkObject[] = this._objets.concat(this._additionnalObjets);
        for (let i = 0; i < allObjectsArray.length; i++) {
            if(allObjectsArray[i].spawnAttributes.type === type){
                objects.push(allObjectsArray[i]);
            }
        }
        return objects;
    }

    /**
     * Remove the given object from the map
     * @param object The object to destroy
     */
    public applyDestroyObject(object:NetworkObject){
        let index:number = this._objets.indexOf(object);
        if(index != -1){
            this._objets.splice(index,1);
            this._networkManager.sendGlobalMessage(ServerEventType.DESTROY,object.spawnAttributes.id);
        }else{
            index = this._additionnalObjets.indexOf(object);
            if(index != -1){
                this._additionnalObjets.splice(index,1);
                this._networkManager.sendGlobalMessage(ServerEventType.DESTROY,object.spawnAttributes.id);
            }
        }
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
            this.spawnObject(NetworkObjectType.FLOWER,HexaGrid.getRandomPlaceOnMap(),0,false);
        }
    }

    private spawnRandomPickableObject(){
        this.spawnObject((Math.random() > NetworkObjectsManager.PESTICIDE_SPAWN_RATE)?NetworkObjectType.POLLEN:NetworkObjectType.PESTICIDE,HexaGrid.getRandomPlaceOnMap(),0,false);
    }
    
    /**
     * Get a unique id for a new object
     * @returns The next object id
     */
    private getNextId() : number {
        return this._nextId++;
    }
}