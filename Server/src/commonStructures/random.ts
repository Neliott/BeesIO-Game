import { randomInt } from "crypto";

export default class Random {
    public static Range(min:number,max:number):number{
        return randomInt(max-min)+min;
    }
}