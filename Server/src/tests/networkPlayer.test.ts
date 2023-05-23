import NetworkObjectSpawnAttributes from "../commonStructures/networkObjectSpawnAttributes";
import NetworkObjectType from "../commonStructures/networkObjectType";
import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "../commonStructures/networkPlayerInputState";
import Position from "../commonStructures/position";
import NetworkManager from "../networkManager";
import NetworkPlayer from "../networkPlayer";
import NetworkObject from "../objects/networkObject";
import TestHelper from "./testHelper";

describe('NetworkPlayer',() => {
    beforeAll(() => {
        NetworkManager.CONNECTION_TIMEOUT = 100;
    });
    it('ctor_fixedAttributes_equals', () => {
        expect(new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0))).fixedAttributes.id).toBe(10);
    });
    it('ctor_initialPosition_equals', () => {
        expect(new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(1,0))).currentSimulationState.position.x).toBe(1);
    });
    it('movementTick_position_equals', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(1,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
    });
    it('movementTick_simulationFrame_equals', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.simulationFrame).toBe(123);
    });
    it('movementTick_restrictPositionInsideMapBounds_equals', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(10000,10000)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(NetworkPlayer.MAX_X_POSITION);
        expect(networkPlayer.currentSimulationState.position.y).toBe(NetworkPlayer.MAX_Y_POSITION);
    });
    it('movementTick_restrictPositionInsideMapBoundsNegative_equals', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(-10000,-10000)));
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.networkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(-NetworkPlayer.MAX_X_POSITION);
        expect(networkPlayer.currentSimulationState.position.y).toBe(-NetworkPlayer.MAX_Y_POSITION);
    });
    it('lastSeen_isEnabled_true', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('lastSeen_isEnabled_false', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        expect(networkPlayer.isEnabled).toBe(false);
    });
    it('updateLastSeen_isEnabled_true', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkPlayer.updateLastSeen();
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('enqueueInputStream_isEnabled_true', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkPlayer.enqueueInputStream(new NetworkPlayerInputState(1,0));
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('pickup_objectCount_equals', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0)));
        expect(networkPlayer.pickupNetworkObjects.length).toBe(1);
    });
    it('pickup_multiple_objectCount_equals', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(1,NetworkObjectType.POLLEN,new Position(0,0),0)));
        expect(networkPlayer.pickupNetworkObjects.length).toBe(2);
    });
    it('networkTick_pickedUpObjectPosition_equals', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0)));
        networkPlayer.networkTick();
        expect(networkPlayer.pickupNetworkObjects[0].currentPosition.x).toBe(-1);//Changed to -1
        expect(networkPlayer.pickupNetworkObjects[0].currentPosition.y).toBe(0);//Not changed (cause movement is only on x axis)
    });
    it('networkTick_pickedUpMultipleObjectsPositions_equals', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(1,NetworkObjectType.POLLEN,new Position(100,100),0)));
        networkPlayer.networkTick();
        expect(networkPlayer.pickupNetworkObjects[1].currentPosition.x).toBeCloseTo(-0.28938);//Max position from 100
        expect(networkPlayer.pickupNetworkObjects[1].currentPosition.y).toBeCloseTo(0.703580);//Max position from 100
    });
    /*it('drop_objectCount_equals', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        let networkObject = new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(0,NetworkObjectType.POLLEN,new Position(0,0),0)));
        networkPlayer.pickup(new NetworkObject(new NetworkObjectSpawnAttributes(1,NetworkObjectType.POLLEN,new Position(0,0),0)));
        networkPlayer.drop();
        expect(networkPlayer.pickupNetworkObjects.length).toBe(0);
    });*/
});