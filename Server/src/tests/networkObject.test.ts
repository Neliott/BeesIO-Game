import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "../commonStructures/networkObjectType";
import Position from "../commonStructures/position";
import NetworkObject from "../objects/networkObject";

describe('NetworkObject',() => {
    it('ctor_works', () => {
        //Given + When
        let object:NetworkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //Then
        expect(object).not.toBeNull();
    })
    it('pickup_hasAlreadyMoved_true', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //When
        object.pickup();
        //Then
        expect(object.hasAlreadyMoved).toBe(true);
    })
    it('pickup_isPickedUp_true', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //When
        object.pickup();
        //Then
        expect(object.isPickedUp).toBe(true);
    })
    it('drop_isPickedUp_false', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        object.pickup();
        //When
        object.drop();
        //Then
        expect(object.isPickedUp).toBe(false);
    })
    it('drop_hasAlreadyMoved_true', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        object.pickup();
        //When
        object.drop();
        //Then
        expect(object.hasAlreadyMoved).toBe(true);
    })
    it('currentPosition_changePosition_equal', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //When
        object.currentPosition = new Position(1,1);
        //Then
        expect(object.currentPosition).toEqual(new Position(1,1));
    })
});