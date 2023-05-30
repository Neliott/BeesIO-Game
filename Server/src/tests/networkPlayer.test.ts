import NetworkObjectType from "../commonStructures/networkObjectType";
import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "../commonStructures/networkPlayerInputState";
import Position from "../commonStructures/position";
import NetworkManager from "../networkManager";
import NetworkPlayer from "../players/networkPlayer";
import NetworkManagerMock from "./networkManagerMock";
import TestHelper from "./testHelper";

describe('NetworkPlayer',() => {
    beforeAll(() => {
        NetworkManager.CONNECTION_TIMEOUT = 100;
    });
    it('ctor_fixedAttributes_equals', () => {
        let managerMock = new NetworkManagerMock();
        expect(new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0))).fixedAttributes.id).toBe(10);
    });
    it('ctor_initialPosition_equals', () => {
        let managerMock = new NetworkManagerMock();
        expect(new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(1,0))).currentSimulationState.position.x).toBe(1);
    });
    it('movementTick_position_equals', () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(1,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
    });
    it('movementTick_simulationFrame_equals', () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.simulationFrame).toBe(123);
    });
    it('movementTick_restrictPositionInsideMapBounds_equals', () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(10000,10000)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(NetworkPlayer.MAX_X_POSITION);
        expect(networkPlayer.currentSimulationState.position.y).toBe(NetworkPlayer.MAX_Y_POSITION);
    });
    it('movementTick_restrictPositionInsideMapBoundsNegative_equals', () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(-10000,-10000)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(-NetworkPlayer.MAX_X_POSITION);
        expect(networkPlayer.currentSimulationState.position.y).toBe(-NetworkPlayer.MAX_Y_POSITION);
    });
    it('lastSeen_isEnabled_true', () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('lastSeen_isEnabled_false', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        expect(networkPlayer.isEnabled).toBe(false);
    });
    it('updateLastSeen_isEnabled_true', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkPlayer.updateLastSeen();
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('enqueueInputStream_isEnabled_true', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(1,0));
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('pickup_objectCount_equals', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        let newObject = managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(0,0),0);
        let pickupObject = networkPlayer.tryToPickup();
        expect(pickupObject?.spawnAttributes.id).toBe(newObject.spawnAttributes.id);
    });
    it('pickup_multiple_objectCount_equals', async () => {
        let managerMock = new NetworkManagerMock();
        let objectsToSpawn = 2;
        let pickupCount = 3;
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        for (let index = 0; index < objectsToSpawn; index++) {
            managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(0,0),0);
        }
        for (let index = 0; index < pickupCount; index++) {
            networkPlayer.tryToPickup();
        }
        expect(networkPlayer.pickupNetworkObjects.length).toBe(2);
    });
    it('pickup_multiple_objectCount_equals', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(0,0),0);
        networkPlayer.tryToPickup();
        let nullObject = networkPlayer.tryToPickup();
        expect(nullObject).toBeNull();
    });
    it('networkTick_pickedUpObjectPosition_equals', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(0,0),0);
        networkPlayer.tryToPickup();
        networkPlayer.networkTick();
        expect(networkPlayer.pickupNetworkObjects[0].currentPosition.x).toBe(-1);//Changed to -1
        expect(networkPlayer.pickupNetworkObjects[0].currentPosition.y).toBe(0);//Not changed (cause movement is only on x axis)
    });
    it('networkTick_pickedUpMultipleObjectsPositions_equals', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(0,0),0);
        networkPlayer.tryToPickup();
        let secondObject = managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(1.5,1.5),0);
        networkPlayer.tryToPickup();
        networkPlayer.networkTick();
        expect(secondObject.currentPosition.x).toBeCloseTo(-0.14);
        expect(secondObject.currentPosition.y).toBeCloseTo(0.51);
    });
    it('drop_objectCount_equals', async () => {
        let managerMock = new NetworkManagerMock();
        let networkPlayer = new NetworkPlayer(managerMock,new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        managerMock.objectsManager.spawnObject(NetworkObjectType.POLLEN,new Position(0,0),0);
        networkPlayer.tryToPickup();
        networkPlayer.drop();
        expect(networkPlayer.pickupNetworkObjects.length).toBe(0);
    });
});