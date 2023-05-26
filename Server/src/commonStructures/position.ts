/**
 * A 2d point in the space used to represent a position
 */
export default class Position {
    
    /**
     * The x coordinate
     */
    public x : number;
    
    /**
     * The y coordinate
     */
    public y : number;
    
    /**
     * Create a new position from the given coordinates
     * @param x The x coordinate
     * @param y The y coordinate
     */
    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Is the other object equal ?
     * @param other The other object to compare value
     * @returns Is the object values equal ?
     */
    public equals(other:Position):boolean{
        return other.x === this.x && other.y === this.y;
    }

    /**
     * Translates the position in the given direction
     * @param directionInDegree The direction in degrees
     * @param distance The distance to translate
     */
    public translate(directionInDegree:number, distance:number) {
        const directionRadiants = directionInDegree * Math.PI / 180;
        this.x += Math.cos(directionRadiants) * distance;
        this.y += Math.sin(directionRadiants) * distance;
    }

    /**
     * Add the other position to this one
     * @param other The other position to add
     */
    public add(other:Position){
        this.x += other.x;
        this.y += other.y;
    }

    /**
     * Subtract the other position to this one
     * @param other The other position to subtract
     */
    public subtract(other: Position) {
        this.x -= other.x;
        this.y -= other.y;
    }

    /**
     * Get a clone of this position (other object)
     * @returns A clone of this position
     */
    public clone():Position{
        return new Position(this.x,this.y);
    }

    /**
     * Get the distance between two positions
     * @param one The first position
     * @param two The second position
     * @returns The distance between the two positions
     */
    public static distance(one:Position,two:Position):number{
        return Math.sqrt(Math.pow(one.x - two.x,2) + Math.pow(one.y - two.y,2));
    }
}