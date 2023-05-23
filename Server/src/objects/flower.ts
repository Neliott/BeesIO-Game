import NetworkObjectType from "../commonStructures/networkObjectType";
import Position from "../commonStructures/position";
import Random from "../commonStructures/random";
import NetworkManager from "../networkManager";
import NetworkObject from "./networkObject";

export default class Flower extends NetworkObject{
    public static readonly FLOWER_SPAWN_POSITIONS:Position[] = [new Position(0,0.5),new Position(-0.4,-0.25),new Position(0.4,-0.25)];
    public static readonly FLOWER_SPAWN_ROTATIONS:number[] = [0,18,-18];
    public static MAX_SPAWN_TIME = 15;
    public static MIN_SPAWN_TIME = 5;
    
    private _spawnedPollens:(NetworkObject|null)[] = [null,null,null];
    private _clock:number = Flower.MAX_SPAWN_TIME;

    public override networkTick(): void {
        this._clock -= NetworkManager.TICK_INTERVAL;
        if(this._clock <= 0){
            this._clock = Random.Range(Flower.MIN_SPAWN_TIME,Flower.MAX_SPAWN_TIME);
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