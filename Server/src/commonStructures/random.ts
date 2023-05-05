import { randomInt } from "crypto";

/**
 * Random number generator. Used as an equivalent to the Random class in C# Unity.
 */
export default class Random {
    /**
     * Generates a random number between 0 and 1.
     * @param min The minimum value of the random number.
     * @param max The maximum value of the random number.
     * @returns The random number.
     */
    public static Range(min:number,max:number):number{
        return randomInt(max-min)+min;
    }
}