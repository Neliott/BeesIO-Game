import NetworkObjectType from "./networkObjectType";
import Position from "./position";

export default class NetworkObjectSpawnAttributes {
    public id : number;
    public type : NetworkObjectType;
    public position : Position;
    public direction : number;
    
    constructor(id:number,type:NetworkObjectType,position:Position,direction:number) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.direction = direction;
    }
}