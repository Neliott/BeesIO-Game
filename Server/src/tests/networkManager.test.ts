import InitialGameState from "../commonStructures/initialGameState";
import Position from "../commonStructures/position";
import NetworkManager from "../networkManager";
import NetworkPlayer from "../players/networkPlayer";
import Flower from "../objects/flower";
import NetworkObjectsManager from "../objects/networkObjectsManager";
import TestHelper from "./testHelper";
import WebSocketMock from "./webSocketMock";

describe('NetworkManager',() => {
    beforeAll(() => {
        Flower.MAX_SPAWN_TIME = 3600;
        Flower.MIN_SPAWN_TIME = 3600;
        NetworkObjectsManager.SPAWN_OBJECTS_INTERVAL = 3600;
        NetworkManager.CONNECTION_TIMEOUT = 100;
    });
    it('ctor_works', () => {
        //Given + When
        let networkManager:NetworkManager = new NetworkManager(false);
        //Then
        expect(networkManager).not.toBeNull();
    });
    it('ctor_clientsManager_notNull', () => {
        //Given + When
        let networkManager = new NetworkManager(false);
        //Then
        expect(networkManager.clientsManager).not.toBeNull();
    });
    it('ctor_clients_empty', () => {
        //Given + When
        let networkManager = new NetworkManager(false);
        //Then
        expect(networkManager.clientsManager.getClientsList().length).toBe(0);
    });
    it('onMessage_join_playerCount_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.onMessage(ws,"0|\"test\"");
        //Then
        expect(networkManager.clientsManager.getClientsList().length).toBe(1);
    });
    it('onMessage_join_playerName_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.onMessage(ws,"0|\"test\"");
        //Then
        expect(networkManager.clientsManager.getNetworkPlayer(ws)?.fixedAttributes.name).toBe("test");
    });
    it('onMessage_join_initialObjectListCount_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.onMessage(ws,"0|\"test\"");
        //Then
        let initialStateReceived = JSON.parse(ws.dataSent[0].substring(2)) as InitialGameState;
        expect(initialStateReceived.objects.length).toBe(NetworkObjectsManager.TARGET_OBJECTS_AMOUNT+NetworkObjectsManager.FLOWERS_AMOUNT);
    });
    it('onMessage_join_playerId_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.onMessage(ws,"0|\"test\"");
        //Then
        expect(networkManager.clientsManager.getNetworkPlayer(ws)?.fixedAttributes.id).toBe(0);
    });
    it('onMessage_join_multiplePlayerId_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        let ws2 = new WebSocketMock();
        //When
        networkManager.onMessage(ws,"0|\"test\"");
        networkManager.onMessage(ws2,"0|\"test2\"");
        //Then
        expect(networkManager.clientsManager.getNetworkPlayer(ws)?.fixedAttributes.id).toBe(0);
        expect(networkManager.clientsManager.getNetworkPlayer(ws2)?.fixedAttributes.id).toBe(1);
    });
    it('onMessage_networkTick_flowerSpawnNumber_equal',() => {
        //Given
        Flower.MAX_SPAWN_TIME = 0;
        Flower.MIN_SPAWN_TIME = 0;
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        //When
        networkManager.networkTick();
        //Then
        expect(ws.dataSent.filter(x => x.startsWith("3|")).length).toBe(NetworkObjectsManager.FLOWERS_AMOUNT);
    });
    it('onMessage_move_positionX_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.getNetworkPlayer(ws)!;
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        //When
        networkManager.onMessage(ws,"2|{\"simulationFrame\":1,\"direction\":0}"); 
        networkManager.networkTick();
        //Then
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(0);
    });
    it('onMessage_move_positionY_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.getNetworkPlayer(ws)!;
        //When
        networkManager.onMessage(ws,"2|{\"simulationFrame\":1,\"direction\":90}"); 
        networkManager.networkTick();
        //Then
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(0); 
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
    });
    it('onMessage_move_positionXY_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.getNetworkPlayer(ws)!;
        //When
        networkManager.onMessage(ws,"2|{\"simulationFrame\":1,\"direction\":-45}"); 
        networkManager.networkTick();
        //Then
        let currentPosition = networkPlayer.currentSimulationState.position;
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(0.45961940);
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(-0.45961940);
    });
    it('onMessage_doubleMove_positionY_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.getNetworkPlayer(ws)!;
        //When
        networkManager.onMessage(ws,"2|{\"simulationFrame\":1,\"direction\":90}"); 
        networkManager.onMessage(ws,"2|{\"simulationFrame\":2,\"direction\":90}"); 
        networkManager.networkTick();
        //Then
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(0); 
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(NetworkPlayer.SPEED*2/NetworkManager.TICK_PER_SECONDS);
    });
    it('onMessage_moveUndefinedWebSocket_positionX_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.getNetworkPlayer(ws)!;
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        //When
        networkManager.onMessage(new WebSocketMock(),"2|{\"simulationFrame\":1,\"direction\":0}"); 
        networkManager.networkTick();
        //Then
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(0);
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(0);
    });
    it('onMessage_wait_isEnabledPlayer_false',async () => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        //When
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkManager.networkTick();
        //Then
        expect(networkManager.clientsManager.getNetworkPlayer(ws)?.isEnabled).toBeFalsy();
    });
    it('onMessage_waitAndReconnect_rejoin_sent',async () => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        await TestHelper.wait(NetworkManager.CONNECTION_TIMEOUT+10);
        networkManager.networkTick();
        //When
        networkManager.onMessage(ws,"1|0");
        networkManager.networkTick();
        //Then
        expect(ws.dataSent.filter(x => x.startsWith("9|")).length).toBe(2);
    });
    it('onClose_playercount_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        expect(networkManager.clientsManager.getClientsList().length).toBe(1);
        //When
        networkManager.onClose(ws);
        //Then
        expect(networkManager.clientsManager.getClientsList().length).toBe(0);
    });
    it('onClose_unknownSender_playercount_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.onMessage(ws,"0|\"test\"");
        //When
        networkManager.onClose(new WebSocketMock());
        //Then
        expect(networkManager.clientsManager.getClientsList().length).toBe(1);
    });
    //TODO: Test spawnParticule + object auto regeneration
});