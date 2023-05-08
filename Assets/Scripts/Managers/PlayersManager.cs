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

    [SerializeField] NetworkPlayer _networkPrefab;
    [SerializeField] CameraTracker _playerTracker;

    int _simulationStateStartIndex = 0;
    int? _playerIdOwned = null;

    /// <summary>
    /// Spawn a new player in the map
    /// </summary>
    /// <param name="networkPlayerAttributes">The new player attributes</param>
    public void SpawnPlayer(NetworkPlayerFixedAttributes networkPlayerAttributes)
    {
        if (_networkedClients.ContainsKey(networkPlayerAttributes.id))
        {
            Debug.LogWarning("The networked client (" + networkPlayerAttributes.id + ") has already spawned!");
            _networkedClients[networkPlayerAttributes.id].NetworkSetup(networkPlayerAttributes);
        }
        else
        {
            NetworkPlayer playerInstance = Instantiate(_networkPrefab);
            playerInstance.NetworkSetup(networkPlayerAttributes);
            _networkedClients.Add(networkPlayerAttributes.id, playerInstance);
        }

        if (_playerIdOwned != null && _playerIdOwned == networkPlayerAttributes.id) FinalizePlayerSetup();
    }

    /// <summary>
    /// Remove and destroy a given player id (when left)
    /// </summary>
    /// <param name="playerId">The id of the player to destroy</param>
    public void RemovePlayer(int playerId)
    {
        Destroy(_networkedClients[playerId].gameObject);
        _networkedClients.Remove(playerId);
    }

    /// <summary>
    /// Apply the initial game state (in a player context). Spawn all players and apply ownership.
    /// </summary>
    /// <param name="initialGameState">The full InitialGameState object</param>
    public void ApplyInitialGameState(InitialGameState initialGameState)
    {
        foreach (var playerAttribute in initialGameState.otherClientsInitialAttributes)
        {
            SpawnPlayer(playerAttribute);
        }
        _simulationStateStartIndex = initialGameState.simulationStateStartIndex;
        ApplyOwnership(initialGameState.ownedClientID);
    }

    private void ApplyOwnership(int? newId)
    {
        _playerIdOwned = newId;
        if (newId != null && _networkedClients.ContainsKey(newId.Value))
        {
            _playerTracker.TrackedObject = _networkedClients[newId.Value].transform;
            FinalizePlayerSetup();
        }
    }

    private void FinalizePlayerSetup()
    {
        _myClientInstance = _networkedClients[_playerIdOwned.Value];
        _myClientInstance.AdditionnalNetworkSetupForOwnedClient(_simulationStateStartIndex);
    }
}
