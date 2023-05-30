import NetworkObjectType from "../commonStructures/networkObjectType";
import Position from "../commonStructures/position";
import Random from "../commonStructures/random";
import NetworkManager from "../networkManager";
import NetworkObject from "./networkObject";

/**
 * A flower is an object that can spawn pollen in the map at a random interval
 * at predefined positions.
 */
export default class Flower extends NetworkObject{
    /**
     * The spawn positions of the pollen
     */
    public static readonly FLOWER_SPAWN_POSITIONS:Position[] = [new Position(0,0.5),new Position(-0.4,-0.25),new Position(0.4,-0.25)];
    /**
     * The spawn rotations of the pollen
     */
    public static readonly FLOWER_SPAWN_ROTATIONS:number[] = [0,18,-18];
    /**
     * The maximum time in seconds between two pollen spawns
     */
    public static MAX_SPAWN_TIME = 15;
    /**
     * The minimum time in seconds between two pollen spawns
     */
    public static MIN_SPAWN_TIME = 5;
    
    private _spawnedPollens:(NetworkObject|null)[] = [null,null,null];
    private _clock:number = Flower.MAX_SPAWN_TIME;

    /**
     * Detect if the flower has valid pollen
     */
    public get hasPollen() : boolean {
        for (let i = 0; i < this._spawnedPollens.length; i++) {
            if(this._spawnedPollens[i] != null && !this._spawnedPollens[i]?.hasAlreadyMoved){
                return true;
            }
        }
        return false;
    }

    /**
     * Spawn pollen if needed
     */
    public override networkTick(): void {
        this._clock -= NetworkManager.TICK_INTERVAL;
        if(this._clock <= 0){
            this._clock = Random.rangeFloat(Flower.MIN_SPAWN_TIME,Flower.MAX_SPAWN_TIME);
            this.tryToSpawnPollen();
        }
    }

    private tryToSpawnPollen():void{
        for (let i = 0; i < this._spawnedPollens.length; i++) {
            if(this._spawnedPollens[i] == null || this._spawnedPollens[i]?.hasAlreadyMoved){
                this.spawnPollenAt(i);
                return;
            }
        }
    }

    private spawnPollenAt(index:number):void{
        let spawnPosition:Position = Flower.FLOWER_SPAWN_POSITIONS[index].clone();
        spawnPosition.add(this.currentPosition);
        let spawnRotation:number = Flower.FLOWER_SPAWN_ROTATIONS[index];
        this._spawnedPollens[index] = this._networkManager.objectsManager.spawnObject(NetworkObjectType.POLLEN,spawnPosition,spawnRotation);
    }
}