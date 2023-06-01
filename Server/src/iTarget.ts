import Position from "./commonStructures/position";

/**
 * This simple interface is used to make an object targetable by a bot
 */
export default interface iTarget {
    /**
     * Get the current position of the target
     */
    get currentPosition() : Position;
}