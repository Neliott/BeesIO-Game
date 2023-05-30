import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "../commonStructures/networkObjectType";
import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import Position from "../commonStructures/position";
import NetworkObject from "../objects/networkObject";
import NetworkManagerMock from "./networkManagerMock";
import NetworkPlayer from "../players/networkPlayer";

describe('NetworkObject',() => {
    it('ctor_works', () => {
        //Given + When
        let managerMock = new NetworkManagerMock();
        let object:NetworkObject = new NetworkObject(managerMock,new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //Then
        expect(object).not.toBeNull();
    })
    it('pickup_hasAlreadyMoved_true', () => {
        //Given
        let managerMock = new NetworkManagerMock();
        let object:NetworkObject = new NetworkObject(managerMock,new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        //When
        object.pickup(player);
        //Then
        expect(object.hasAlreadyMoved).toBe(true);
    })
    it('pickup_owner_equal', () => {
        //Given
        let managerMock = new NetworkManagerMock();
        let object:NetworkObject = new NetworkObject(managerMock,new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        //When
        object.pickup(player);
        //Then
        expect(object.owner).toBe(player);
    })
    it('drop_owner_null', () => {
        //Given
        let managerMock = new NetworkManagerMock();
        let object:NetworkObject = new NetworkObject(managerMock,new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        object.pickup(player);
        //When
        object.drop();
        //Then
        expect(object.owner).toBeNull();
    })
    it('drop_hasAlreadyMoved_true', () => {
        //Given
        let managerMock = new NetworkManagerMock();
        let object:NetworkObject = new NetworkObject(managerMock,new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        let player:NetworkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(0,0,"",new Position(0,0)));
        object.pickup(player);
        //When
        object.drop();
        //Then
        expect(object.hasAlreadyMoved).toBe(true);
    })
    it('currentPosition_changePosition_equal', () => {
        //Given
        let managerMock = new NetworkManagerMock();
        let object:NetworkObject = new NetworkObject(managerMock,new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        //When
        object.currentPosition = new Position(1,1);
        //Then
        expect(object.currentPosition).toEqual(new Position(1,1));
    })
});