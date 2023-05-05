import Position from "./position";

export default class NetworkPlayerFixedAttributes {
    public id : number;
    public colorHue : number;
    public name : string;
    public basePosition : Position;
    
    constructor(id:number, colorHue:number, name:string, basePosition:Position) {
        this.id = id;
        this.colorHue = colorHue;
        this.name = name;
        this.basePosition = basePosition;
    }
}