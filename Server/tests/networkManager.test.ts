import NetworkManager from "../src/networkManager";

describe('NetworkManager',() => {
    it('ctor_works', () => {
        let networkManager:NetworkManager = new NetworkManager();
        expect(networkManager).not.toBeNull();
    });
    it('ctor_clientsManager_notNull', () => {
        let networkManager = new NetworkManager();
        expect(networkManager.clientsManager).not.toBeNull();
    });
    it('ctor_clients_empty', () => {
        let networkManager = new NetworkManager();
        expect(networkManager.clientsManager.GetClientsList().length).toBe(0);
    });
});