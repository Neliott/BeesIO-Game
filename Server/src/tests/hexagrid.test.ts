import Position from "../commonStructures/position";
import Random from "../commonStructures/random";
import HexaGrid from "../hexagrid";

describe('Hexagrid',() => {
    it('spacesTransformationTwoWays_positionIndex_equals', () => {
        //Given
        const expectedHexIndex:Position= new Position(Random.Range(0, 200), Random.Range(0, 200));
        //When
        const worldPosition:Position = HexaGrid.hexIndexesToWorldPosition(expectedHexIndex);
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(worldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });
    it('wordPositionToHexIndexes_center_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(0, 0);
        const expectedHexIndex:Position = new Position(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(expectedWorldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });
    it('wordPositionToHexIndexes_shiftedX_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH, 0);
        const expectedHexIndex:Position = new Position((HexaGrid.MAP_WIDTH / 2) + 1, HexaGrid.MAP_HEIGHT / 2);
        //When
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(expectedWorldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });
    it('wordPositionToHexIndexes_shiftedY_equals', () => {
        console.log("MARKER!");
        //Given
        const expectedWorldPosition:Position = new Position(0, HexaGrid.SPACING_HEIGHT);
        const expectedHexIndex:Position = new Position(HexaGrid.MAP_WIDTH / 2 + 1, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(expectedWorldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });
    it('wordPositionToHexIndexes_shiftedXY_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH, HexaGrid.SPACING_HEIGHT);
        const expectedHexIndex:Position = new Position(HexaGrid.MAP_WIDTH / 2 + 2, HexaGrid.MAP_HEIGHT / 2 + 1);
        //When
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(expectedWorldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });
    it('wordPositionToHexIndexes_shiftedXYDouble_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH, HexaGrid.SPACING_HEIGHT*2);
        const expectedHexIndex:Position = new Position(HexaGrid.MAP_WIDTH / 2 + 1, HexaGrid.MAP_HEIGHT / 2 + 2);
        //When
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(expectedWorldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });
    it('wordPositionToHexIndexes_shiftedXYRound_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH / 2.5, HexaGrid.SPACING_HEIGHT / 2.5);
        const expectedHexIndex:Position = new Position(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        const actualIndex:Position = HexaGrid.wordPositionToHexIndexes(expectedWorldPosition);
        //Then
        expect(actualIndex.x).toBe(expectedHexIndex.x);
        expect(actualIndex.y).toBe(expectedHexIndex.y);
    });

    it('hexIndexesToWorldPosition_center_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(0, 0);
        const expectedIndexes:Position = new Position(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        const actualWorldPosition:Position = HexaGrid.hexIndexesToWorldPosition(expectedIndexes);
        //Then
        expect(actualWorldPosition.x).toBe(expectedWorldPosition.x);
        expect(actualWorldPosition.y).toBe(expectedWorldPosition.y);
    });
    it('hexIndexesToWorldPosition_shiftedX_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH, 0);
        const expectedIndexes:Position = new Position(HexaGrid.MAP_WIDTH / 2 + 1, HexaGrid.MAP_HEIGHT / 2);
        //When
        const actualWorldPosition:Position = HexaGrid.hexIndexesToWorldPosition(expectedIndexes);
        //Then
        expect(actualWorldPosition.x).toBe(expectedWorldPosition.x);
        expect(actualWorldPosition.y).toBe(expectedWorldPosition.y);
    });
    it('hexIndexesToWorldPosition_shiftedY_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH*0.5, HexaGrid.SPACING_HEIGHT);
        const expectedIndexes:Position = new Position(HexaGrid.MAP_WIDTH / 2 + 1, HexaGrid.MAP_HEIGHT / 2 + 1);
        //When
        const actualWorldPosition:Position = HexaGrid.hexIndexesToWorldPosition(expectedIndexes);
        //Then
        expect(actualWorldPosition.x).toBe(expectedWorldPosition.x);
        expect(actualWorldPosition.y).toBe(expectedWorldPosition.y);
    });
    it('hexIndexesToWorldPosition_shiftedXY_equals', () => {
        //Given
        const expectedWorldPosition:Position = new Position(HexaGrid.SPACING_WIDTH*1.5, HexaGrid.SPACING_HEIGHT);
        const expectedIndexes:Position = new Position(HexaGrid.MAP_WIDTH / 2 + 2, HexaGrid.MAP_HEIGHT / 2 + 1);
        //When
        const actualWorldPosition:Position = HexaGrid.hexIndexesToWorldPosition(expectedIndexes);
        //Then
        expect(actualWorldPosition.x).toBe(expectedWorldPosition.x);
        expect(actualWorldPosition.y).toBe(expectedWorldPosition.y);
    });
    
    it('wordPositionToHexIndexes_getBigHexagonPositionWithFill_equals', () => {
        //Given
        const center = new Position(0, 0);
        const radius = 4;
        const outline = false;
        const expectedHexagonPositions = [
            new Position(-1,-3),
            new Position(0,-3),
            new Position(1,-3),
            new Position(2,-3),
            new Position(-2,-2),
            new Position(-1,-2),
            new Position(0,-2),
            new Position(1,-2),
            new Position(2,-2),
            new Position(-2,-1),
            new Position(-1,-1),
            new Position(0,-1),
            new Position(1,-1),
            new Position(2,-1),
            new Position(3,-1),
            new Position(-3,0),
            new Position(-2,0),
            new Position(-1,0),
            new Position(0,0),
            new Position(1,0),
            new Position(2,0),
            new Position(3,0),
            new Position(-2,1),
            new Position(-1,1),
            new Position(0,1),
            new Position(1,1),
            new Position(2,1),
            new Position(3,1),
            new Position(-2,2),
            new Position(-1,2),
            new Position(0,2),
            new Position(1,2),
            new Position(2,2),
            new Position(-1,3),
            new Position(0,3),
            new Position(1,3),
            new Position(2,3),
        ];
        //When
        const actualHexagonPositions:Position[] = HexaGrid.getBigHexagonPositions(center, radius, outline);
        //Then
        expect(actualHexagonPositions).toEqual(expectedHexagonPositions);
    });
    it('wordPositionToHexIndexes_getBigHexagonPositionOnlyOutline_equals', () => {
        //Given
        const center = new Position(0, 0);
        const radius = 4;
        const outline = true;
        const expectedHexagonPositions = [
            new Position(-1,-3),
            new Position(0,-3),
            new Position(1,-3),
            new Position(2,-3),
            new Position(-2,-2),
            new Position(2,-2),
            new Position(-2,-1),
            new Position(3,-1),
            new Position(-3,0),
            new Position(3,0),
            new Position(-2,1),
            new Position(3,1),
            new Position(-2,2),
            new Position(2,2),
            new Position(-1,3),
            new Position(0,3),
            new Position(1,3),
            new Position(2,3),
        ];
        //When
        const actualHexagonPositions:Position[] = HexaGrid.getBigHexagonPositions(center, radius, outline);
        //Then
        expect(actualHexagonPositions).toEqual(expectedHexagonPositions);
    });
    it('wordPositionToHexIndexes_getBigHexagonPositionBigRadiusWithFillShiftedY_equals', () => {
        //Given
        const center = new Position(0, 1);
        const radius = 7;
        const outline = false;
        const expectedHexagonPositions = [
            new Position(-3,-5),
            new Position(-2,-5),
            new Position(-1,-5),
            new Position(0,-5),
            new Position(1,-5),
            new Position(2,-5),
            new Position(3,-5),
            new Position(-4,-4),
            new Position(-3,-4),
            new Position(-2,-4),
            new Position(-1,-4),
            new Position(0,-4),
            new Position(1,-4),
            new Position(2,-4),
            new Position(3,-4),
            new Position(-4,-3),
            new Position(-3,-3),
            new Position(-2,-3),
            new Position(-1,-3),
            new Position(0,-3),
            new Position(1,-3),
            new Position(2,-3),
            new Position(3,-3),
            new Position(4,-3),
            new Position(-5,-2),
            new Position(-4,-2),
            new Position(-3,-2),
            new Position(-2,-2),
            new Position(-1,-2),
            new Position(0,-2),
            new Position(1,-2),
            new Position(2,-2),
            new Position(3,-2),
            new Position(4,-2),
            new Position(-5,-1),
            new Position(-4,-1),
            new Position(-3,-1),
            new Position(-2,-1),
            new Position(-1,-1),
            new Position(0,-1),
            new Position(1,-1),
            new Position(2,-1),
            new Position(3,-1),
            new Position(4,-1),
            new Position(5,-1),
            new Position(-6,0),
            new Position(-5,0),
            new Position(-4,0),
            new Position(-3,0),
            new Position(-2,0),
            new Position(-1,0),
            new Position(0,0),
            new Position(1,0),
            new Position(2,0),
            new Position(3,0),
            new Position(4,0),
            new Position(5,0),
            new Position(-6,1),
            new Position(-5,1),
            new Position(-4,1),
            new Position(-3,1),
            new Position(-2,1),
            new Position(-1,1),
            new Position(0,1),
            new Position(1,1),
            new Position(2,1),
            new Position(3,1),
            new Position(4,1),
            new Position(5,1),
            new Position(6,1),
            new Position(-6,2),
            new Position(-5,2),
            new Position(-4,2),
            new Position(-3,2),
            new Position(-2,2),
            new Position(-1,2),
            new Position(0,2),
            new Position(1,2),
            new Position(2,2),
            new Position(3,2),
            new Position(4,2),
            new Position(5,2),
            new Position(-5,3),
            new Position(-4,3),
            new Position(-3,3),
            new Position(-2,3),
            new Position(-1,3),
            new Position(0,3),
            new Position(1,3),
            new Position(2,3),
            new Position(3,3),
            new Position(4,3),
            new Position(5,3),
            new Position(-5,4),
            new Position(-4,4),
            new Position(-3,4),
            new Position(-2,4),
            new Position(-1,4),
            new Position(0,4),
            new Position(1,4),
            new Position(2,4),
            new Position(3,4),
            new Position(4,4),
            new Position(-4,5),
            new Position(-3,5),
            new Position(-2,5),
            new Position(-1,5),
            new Position(0,5),
            new Position(1,5),
            new Position(2,5),
            new Position(3,5),
            new Position(4,5),
            new Position(-4,6),
            new Position(-3,6),
            new Position(-2,6),
            new Position(-1,6),
            new Position(0,6),
            new Position(1,6),
            new Position(2,6),
            new Position(3,6),
            new Position(-3,7),
            new Position(-2,7),
            new Position(-1,7),
            new Position(0,7),
            new Position(1,7),
            new Position(2,7),
            new Position(3,7)
        ];
        //When
        const actualHexagonPositions:Position[] = HexaGrid.getBigHexagonPositions(center, radius, outline);
        //Then
        expect(actualHexagonPositions).toEqual(expectedHexagonPositions);
    });
    it('wordPositionToHexIndexes_getBigHexagonPositionBigRadiusOutlineShiftedY_equals', () => {
        //Given
        const center = new Position(0, 1);
        const radius = 7;
        const outline = true;
        const expectedHexagonPositions = [
            new Position(-3,-5),
            new Position(-2,-5),
            new Position(-1,-5),
            new Position(0,-5),
            new Position(1,-5),
            new Position(2,-5),
            new Position(3,-5),
            new Position(-4,-4),
            new Position(3,-4),
            new Position(-4,-3),
            new Position(4,-3),
            new Position(-5,-2),
            new Position(4,-2),
            new Position(-5,-1),
            new Position(5,-1),
            new Position(-6,0),
            new Position(5,0),
            new Position(-6,1),
            new Position(6,1),
            new Position(-6,2),
            new Position(5,2),
            new Position(-5,3),
            new Position(5,3),
            new Position(-5,4),
            new Position(4,4),
            new Position(-4,5),
            new Position(4,5),
            new Position(-4,6),
            new Position(3,6),
            new Position(-3,7),
            new Position(-2,7),
            new Position(-1,7),
            new Position(0,7),
            new Position(1,7),
            new Position(2,7),
            new Position(3,7)
        ];
        //When
        const actualHexagonPositions:Position[] = HexaGrid.getBigHexagonPositions(center, radius, outline);
        //Then
        expect(actualHexagonPositions).toEqual(expectedHexagonPositions);
    });
});