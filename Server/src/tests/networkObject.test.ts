import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "../commonStructures/networkObjectType";
import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import Position from "../commonStructures/position";
import NetworkPlayer from "../networkPlayer";
import NetworkObject from "../objects/networkObject";
import NetworkManagerMock from "./networkManagerMock";

describe('NetworkObject',() => {
    it('ctor_works', () => {
        //Given + When
        let object:NetworkObject = new NetworkObject(new NetworkManagerMock(),new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //Then
        expect(object).not.toBeNull();
    })
    it('pickup_hasAlreadyMoved_true', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkManagerMock(),new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        //When
        object.pickup(player);
        //Then
        expect(object.hasAlreadyMoved).toBe(true);
    })
    it('pickup_isPickedUp_true', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkManagerMock(),new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        //When
        object.pickup(player);
        //Then
        expect(object.isPickedUp).toBe(true);
    })
    it('drop_isPickedUp_false', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkManagerMock(),new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        object.pickup(player);
        //When
        object.drop();
        //Then
        expect(object.isPickedUp).toBe(false);
    })
    it('drop_hasAlreadyMoved_true', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkManagerMock(),new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        object.pickup(player);
        //When
        object.drop();
        //Then
        expect(object.hasAlreadyMoved).toBe(true);
    })
    it('currentPosition_changePosition_equal', () => {
        //Given
        let object:NetworkObject = new NetworkObject(new NetworkManagerMock(),new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        //When
        object.currentPosition = new Position(1,1);
        //Then
        expect(object.currentPosition).toEqual(new Position(1,1));
    })
});