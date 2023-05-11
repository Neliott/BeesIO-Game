import NetworkPlayerFixedAttributes from "../commonStructures/networkPlayerFixedAttributes";
import NetworkPlayerInputState from "../commonStructures/networkPlayerInputState";
import Position from "../commonStructures/position";
import NetworkManager from "../networkManager";
import NetworkPlayer from "../networkPlayer";

describe('NetworkPlayer',() => {
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
    it('lastSeen_isEnabled_false', () => {
        let networkPlayer = new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0)));
        //TODO
        setTimeout(() => {
            expect(networkPlayer.isEnabled).toBe(false);
        },NetworkManager.CONNECTION_TIMEOUT+1);
    });
});