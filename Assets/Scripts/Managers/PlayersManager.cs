using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Network;
using NetworkPlayer = Network.NetworkPlayer;

/// <summary>
/// Manage all the networked players
/// </summary>
public class PlayersManager : MonoBehaviour
{
    private NetworkPlayer _myClientInstance;

    /// <summary>
    /// Get the current owned player instance
    /// </summary>
    public NetworkPlayer MyClientInstance
    {
        get { return _myClientInstance; }
    }

    private Dictionary<int, NetworkPlayer> _networkedClients = new Dictionary<int, NetworkPlayer>();

    /// <summary>
    /// Get all the network clients by their id
    /// </summary>
    public Dictionary<int, NetworkPlayer> NetworkedClients
    {
        get { return _networkedClients; }
    }

    private int? _currentPlayerIdOwned = null;

    /// <summary>
    /// The id of the current owned local player (can be null)
    /// </summary>
    public int? CurrentPlayerIdOwned
    {
        get
        {
            return _currentPlayerIdOwned;
        }
        set
        {
            _currentPlayerIdOwned = value;
            if (value != null && _networkedClients.ContainsKey(value.Value)) FinalizePlayerSetup();
        }
    }

    private int _simulationStateStartIndex;

    /// <summary>
    /// The simulation state start index for the owned player
    /// </summary>
    public int SimulationStateStartIndex
    {
        private get { return _simulationStateStartIndex; }
        set { _simulationStateStartIndex = value; }
    }


    [SerializeField] NetworkPlayer _networkPrefab;
    [SerializeField] CameraTracker _playerTracker;

    /// <summary>
    /// Spawn a new player in the map
    /// </summary>
    /// <param name="networkPlayerAttributes">The new player attributes</param>
    public void SpawnPlayer(NetworkPlayerFixedAttributes networkPlayerAttributes)
    {
        if (_networkedClients.ContainsKey(networkPlayerAttributes.id))
        {
            _networkedClients[networkPlayerAttributes.id].NetworkSetup(networkPlayerAttributes);
        }
        else
        {
            NetworkPlayer playerInstance = Instantiate(_networkPrefab);
            playerInstance.NetworkSetup(networkPlayerAttributes);
            _networkedClients.Add(networkPlayerAttributes.id, playerInstance);
        }

        if (_currentPlayerIdOwned != null && _currentPlayerIdOwned == networkPlayerAttributes.id) FinalizePlayerSetup();
    }

    /// <summary>
    /// Remove and destroy a given player id (when left)
    /// </summary>
    /// <param name="playerId">The id of the player to destroy</param>
    public void RemovePlayer(int playerId)
    {
        if (!_networkedClients.ContainsKey(playerId)) return;
        Destroy(_networkedClients[playerId].Base.gameObject);
        Destroy(_networkedClients[playerId].gameObject);
        _networkedClients.Remove(playerId);
    }

    /// <summary>
    /// Remove all the clients from the list and the map
    /// </summary>
    public void DestroyAll()
    {
        foreach (var client in _networkedClients)
        {
            Destroy(client.Value.Base.gameObject);
            Destroy(client.Value.gameObject);
        }
        _networkedClients.Clear();
    }

    private void FinalizePlayerSetup()
    {
        _myClientInstance = _networkedClients[_currentPlayerIdOwned.Value];
        _myClientInstance.AdditionnalNetworkSetupForOwnedClient(_simulationStateStartIndex);
        _playerTracker.TrackedObject = _myClientInstance.transform;
    }
}
