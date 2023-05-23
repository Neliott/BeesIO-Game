import ServerEventType from "../commonStructures/serverEventType";
import NetworkObjectsManager from "../objects/networkObjectsManager";
import NetworkManagerMock from "./networkManagerMock";

describe('NetworkObjectsManager',() => {
    it('ctor_works', () => {
        //Given + When
        let managerMock = new NetworkManagerMock();//All the managers are created in the mock constructor
        //Then
        expect(managerMock.objectsManager).not.toBeNull();
    })
    it('ctor_spawnObjects_countEqual', () => {
        //Given + When
        let managerMock = new NetworkManagerMock();
        //Then
        expect(managerMock.globalMessageHistory.filter(msg=>msg==ServerEventType.SPAWN).length).toBe(NetworkObjectsManager.TARGET_OBJECTS_AMOUNT+NetworkObjectsManager.FLOWERS_AMOUNT);
    })
});