/**
 * Random number generator. Used as an equivalent to the Random class in C# Unity.
 */
export default class Random {
    /**
     * Generates a random integer between min and max (inclusive).
     * @param min The minimum value of the random number.
     * @param max The maximum value of the random number.
     * @returns The random number.
     */
    public static rangeInt(min:number,max:number):number{
        return Math.round((Math.random()*(max-min))+min);
    }
    /**
     * Generates a random float number between min and max (inclusive).
     * @param min The minimum value of the random number.
     * @param max The maximum value of the random number.
     * @returns The random number.
     */
    public static rangeFloat(min:number,max:number):number{
        return (Math.random()*(max-min))+min;
    }
}