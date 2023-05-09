import Position from "../commonStructures/position";
import NetworkManager from "../networkManager";
import NetworkPlayer from "../networkPlayer";
import WebSocketMock from "./webSocketMock";

describe('NetworkManager',() => {
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
        expect(networkManager.clientsManager.GetClientsList().length).toBe(0);
    });
    it('onmessage_join_playercount_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.OnMessage(ws,"0|\"test\"");
        //Then
        expect(networkManager.clientsManager.GetClientsList().length).toBe(1);
    });
    it('onmessage_join_playername_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.OnMessage(ws,"0|\"test\"");
        //Then
        expect(networkManager.clientsManager.GetNetworkPlayer(ws)?.fixedAttributes.name).toBe("test");
    });
    it('onmessage_join_playerid_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        //When
        networkManager.OnMessage(ws,"0|\"test\"");
        //Then
        expect(networkManager.clientsManager.GetNetworkPlayer(ws)?.fixedAttributes.id).toBe(0);
    });
    it('onmessage_join_multipleplayerid_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        let ws2 = new WebSocketMock();
        //When
        networkManager.OnMessage(ws,"0|\"test\"");
        networkManager.OnMessage(ws2,"0|\"test2\"");
        //Then
        expect(networkManager.clientsManager.GetNetworkPlayer(ws)?.fixedAttributes.id).toBe(0);
        expect(networkManager.clientsManager.GetNetworkPlayer(ws2)?.fixedAttributes.id).toBe(1);
    });
    it('onmessage_move_positionx_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.OnMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.GetNetworkPlayer(ws)!;
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        //When
        networkManager.OnMessage(ws,"2|{\"simulationFrame\":1,\"direction\":0}"); 
        networkManager.NetworkTick();
        //Then
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
        expect(currentPosition.y-initialPosition.y).toBe(0);
    });
    it('onmessage_move_positiony_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.OnMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.GetNetworkPlayer(ws)!;
        //When
        networkManager.OnMessage(ws,"2|{\"simulationFrame\":1,\"direction\":90}"); 
        networkManager.NetworkTick();
        //Then
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBe(0); 
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(NetworkPlayer.SPEED/NetworkManager.TICK_PER_SECONDS);
    });
    it('onmessage_move_positionxy_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.OnMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.GetNetworkPlayer(ws)!;
        //When
        networkManager.OnMessage(ws,"2|{\"simulationFrame\":1,\"direction\":-45}"); 
        networkManager.NetworkTick();
        //Then
        let currentPosition = networkPlayer.currentSimulationState.position;
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        expect(currentPosition.x-initialPosition.x).toBeCloseTo(0.45961940);
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(-0.45961940);
    });
    it('onmessage_doublemove_positiony_equal',() => {
        //Given
        let networkManager = new NetworkManager(false);
        let ws = new WebSocketMock();
        networkManager.OnMessage(ws,"0|\"test\"");
        let networkPlayer = networkManager.clientsManager.GetNetworkPlayer(ws)!;
        //When
        networkManager.OnMessage(ws,"2|{\"simulationFrame\":1,\"direction\":90}"); 
        networkManager.OnMessage(ws,"2|{\"simulationFrame\":2,\"direction\":90}"); 
        networkManager.NetworkTick();
        //Then
        let initialPosition = networkPlayer.fixedAttributes.basePosition;
        let currentPosition = networkPlayer.currentSimulationState.position;
        expect(currentPosition.x-initialPosition.x).toBe(0); 
        expect(currentPosition.y-initialPosition.y).toBeCloseTo(NetworkPlayer.SPEED*2/NetworkManager.TICK_PER_SECONDS);
    });
});