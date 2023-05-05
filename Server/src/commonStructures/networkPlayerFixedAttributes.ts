import Position from "./position";

/**
 * The fixed attributes of a player.
 */
export default class NetworkPlayerFixedAttributes {
    /**
     * The id of the player.
     */
    public id : number;
    /**
     * The color hue of the player.
     */
    public colorHue : number;
    /**
     * The name of the player.
     */
    public name : string;
    /**
     * The base position of the player.
     */
    public basePosition : Position;
    
    /**
     * The constructor for the NetworkPlayerFixedAttributes class.
     * @param id The id of the player.
     * @param colorHue The color hue of the player.
     * @param name The name of the player.
     * @param basePosition The base position of the player.
     */
    constructor(id:number, colorHue:number, name:string, basePosition:Position) {
        this.id = id;
        this.colorHue = colorHue;
        this.name = name;
        this.basePosition = basePosition;
    }
}