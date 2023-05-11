import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "../commonStructures/networkPlayerInputState";
import Position from "../commonStructures/position";
import NetworkManager from "../networkManager";
import NetworkPlayer from "../networkPlayer";
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
        networkPlayer.EnqueueInputStream(new NetworkPlayerInputState(1,0));
        networkPlayer.NetworkTick();
        expect(networkPlayer.currentSimulationState.position.x).toBe(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
    });
    it('movementTick_simulationFrame_equals', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.EnqueueInputStream(new NetworkPlayerInputState(123,0));
        networkPlayer.NetworkTick();
        expect(networkPlayer.currentSimulationState.simulationFrame).toBe(123);
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
        networkPlayer.UpdateLastSeen();
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('enqueueInputStream_isEnabled_true', async () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkPlayer.EnqueueInputStream(new NetworkPlayerInputState(1,0));
        expect(networkPlayer.isEnabled).toBe(true);
    });
    it('isAppearingOffline_false', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        expect(networkPlayer.isAppearingOffline).toBe(false);
    });
    it('isAppearingOffline_true', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        networkPlayer.isAppearingOffline = true;
        expect(networkPlayer.isAppearingOffline).toBe(true);
    });
});