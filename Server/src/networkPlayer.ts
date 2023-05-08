import NetworkPlayerFixedAttributes from "./commonStructures/networkPlayerFixedAttributes";

/**
 * Represents a player in the network
 */
class NetworkPlayer {
    private _fixedAttributes : NetworkPlayerFixedAttributes;
    /**
     * Returns the fixed attributes of the client
     */
    public get fixedAttributes() : NetworkPlayerFixedAttributes {
        return this._fixedAttributes;
    }

    /**
     * Creates a new NetworkPlayer
     * @param fixedAttributes The initial fixed attributes of the client
     */
    constructor(fixedAttributes:NetworkPlayerFixedAttributes) {
        this._fixedAttributes = fixedAttributes;
    }
}

export default NetworkPlayer;