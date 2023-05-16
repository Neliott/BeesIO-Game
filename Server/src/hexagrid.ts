import Base from "./base";
import HexagonPropertyChanged from "./commonStructures/hexagonPropertyChanged";
import NetworkOwnedHexagonList from "./commonStructures/networkOwnedHexagonList";
import Position from "./commonStructures/position";
import Random from "./commonStructures/random";
import ServerEventType from "./commonStructures/serverEventType";
import NetworkManager from "./networkManager";

/**
 * Represents a hexagongrid on the map that can be possessed by a base
 */
export default class HexaGrid{
    /**
     * The percentage of grid to spawn object (do not spawn in border, they will be innaccesible)
     */
    public static readonly MAP_SAFE_GRID_PERCENTAGE:number = 0.8;
    /**
     * The number of tiles on the X Axis
     */
    public static readonly MAP_WIDTH:number = 100;
    /**
     * The number of tiles on the Y Axis
     */
    public static readonly MAP_HEIGHT:number = 100;
    /**
     * The spacing between two tiles on X axis
     */
    public static readonly SPACING_WIDTH:number = 2;
    /**
     * The spacing between two tiles on Y axis
     */
    public static readonly SPACING_HEIGHT:number = 1.75;

    public static readonly MAP_SAFE_GRID_OFFSET_X = Math.round(HexaGrid.MAP_WIDTH * (1-HexaGrid.MAP_SAFE_GRID_PERCENTAGE));
    public static readonly MAP_SAFE_GRID_OFFSET_Y = Math.round(HexaGrid.MAP_HEIGHT * (1-HexaGrid.MAP_SAFE_GRID_PERCENTAGE));

    /**
     * Get a random place on the map
     * @returns A position on the map inside safe bound
     */
    public static getRandomPlaceOnMap():Position
    {
        const randomXWithBounds = Math.round(Random.Range(HexaGrid.MAP_SAFE_GRID_OFFSET_X, HexaGrid.MAP_WIDTH * HexaGrid.MAP_SAFE_GRID_PERCENTAGE));
        const randomYWithBounds = Math.round(Random.Range(HexaGrid.MAP_SAFE_GRID_OFFSET_Y, HexaGrid.MAP_HEIGHT * HexaGrid.MAP_SAFE_GRID_PERCENTAGE));
        return HexaGrid.hexIndexesToWorldPosition(new Position(randomXWithBounds, randomYWithBounds));
    }

    /**
     * Convert a world spaced position to the nearest hex index
     * @param worldPosition The transform position
     * @returns The nearest hextile index
     */
    public static wordPositionToHexIndexes(worldPosition:Position) : Position
    {
        const y = Math.round((worldPosition.y / HexaGrid.SPACING_HEIGHT) + Math.round(HexaGrid.MAP_HEIGHT / 2));
        const x = Math.round(((worldPosition.x + ((y % 2 == 1)?(HexaGrid.SPACING_WIDTH / 2):0)) / HexaGrid.SPACING_WIDTH) + Math.round(HexaGrid.MAP_WIDTH / 2));
        return new Position(x, y);
    }

    /**
     * Get the center of the hexindex on the map (world position)
     * @param indexes The index of the hextile
     * @returns The center world position of the hextile
     */
    public static hexIndexesToWorldPosition(indexes:Position):Position
    {
        const worldPosition = new Position((indexes.x - Math.round(HexaGrid.MAP_WIDTH / 2)) * HexaGrid.SPACING_WIDTH, (indexes.y - Math.round(HexaGrid.MAP_HEIGHT / 2)) * HexaGrid.SPACING_HEIGHT);
        if (indexes.y % 2 == 1) worldPosition.x = worldPosition.x - (HexaGrid.SPACING_WIDTH / 2);
        return worldPosition;
    }

    /**
     * Get the list of all the hexagons indexes inside a large hexagon
     * @param center The center of the bug hexagon
     * @param radius The radius of the hexagon
     * @param outline Get only the outile ? (Or also all the positions that fill it)
     * @returns The list of all hextiles positions
     */
    public static getBigHexagonPositions(center:Position, radius:number, outline:boolean):Position[]
    {
        const allPositions:Position[] = [];

        //This is necessary to shift the upper and lower parts (by one to the left) if you start with an even line (shifted to the right).
        const xDecal = (center.y + 1) % 2;

        //Loop through the Y axis lines by lines from -radius (-1) to +radius (-1)
        for (let y = -(radius - 1); y < radius; y++)
        {
            const yAbsolute = Math.abs(y);

            //Used to determine the size of the line to use (large if in the center, small if at the beginning or end)
            const xLenth = ((radius * 2) - 1) - yAbsolute;
            const xDrawStart = Math.floor(Math.abs(y / 2));

            //Increment by one (to draw a full line) if the outline is false OR if the y is starting or ending value.
            //Else, increment to go directly to last poconst to draw (if outline ant the y is not the start or end value)
            const incrementor = ((!outline) || Math.abs(y) == (radius - 1)) ? 1 : xLenth - 1;
            for (let x = 0; x < xLenth; x = x + incrementor)
            {
                allPositions.push(new Position(center.x - (radius - 1) + x + xDrawStart + ((yAbsolute % 2 == 1) ? xDecal : 0), center.y + y));
            }
        }
        return allPositions;
    }

    /**
     * All the hexagones owned by bases
     */
    private _hexagonsProperties : Map<Base, Position[]> = new Map();

    private _networkManager : NetworkManager;

    /**
     * Create a new hexagon grid
     * @param networkManager The network manager
     */
    constructor(networkManager:NetworkManager){
        this._networkManager = networkManager;
    }

    /**
     * Set hexagon of a given index to a new property
     * @param position The index of the hexagon
     * @param property The new owner or null for remove owner
     */
    public setHexagonProperty(position:Position, property:Base|null)
    {
        this._networkManager.sendGlobalMessage(ServerEventType.HEXAGON_PROPERTY_CHANGED, new HexagonPropertyChanged((property == null)?-1:property.owner.fixedAttributes.id,position));

        let lastOwner = this.getPropertyOfHexIndex(position);
        if (lastOwner != undefined)
        {
            const positions = this._hexagonsProperties.get(lastOwner);
            positions?.splice(positions.indexOf(position, 0),1);
            lastOwner.onHexagonOwnedListChanged();
        }
        if (property == null) return;
        if (!this._hexagonsProperties.has(property))
        {
            this._hexagonsProperties.set(property, []);
        }
        this._hexagonsProperties.get(property)!.push(position);
        property.onHexagonOwnedListChanged();
    }

    /**
     * Get a copy of the list of hexagons owned by the base at the current status
     * @param givenBase The owner of hexagons
     * @returns The list or null
     */
    public getHexagonsOfBase(givenBase:Base):Position[]|undefined
    {
        return this._hexagonsProperties.get(givenBase);
    }

    /**
     * Get the list of all the hexagons owned by players
     * @returns The list of all the hexagons owned by bases
     */
    public getFullOwnedHexagonList():NetworkOwnedHexagonList[]
    {
        const list = new Array<NetworkOwnedHexagonList>();
        this._hexagonsProperties.forEach((value: Position[], key: Base) => {
            if(value.length != 0)
                list.push(new NetworkOwnedHexagonList(key.owner.fixedAttributes.id, value));
        });
        return list;
    }

    /**
     * Try to get the base for the given hexagon index
     * @param index The index of hexagon
     * @returns The base if owned or null
     */
    public getPropertyOfHexIndex(index:Position):Base|undefined
    {
        for (let [base, positions] of this._hexagonsProperties) {
            for (let i = 0; i < positions.length; i++) {
                if(positions[i].equals(index)){
                    return base;
                }
            }
        }
        return undefined;
    }
}