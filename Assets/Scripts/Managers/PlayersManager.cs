using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayersManager : MonoBehaviour
{
    [SerializeField]
    GameObject _controlledPlayerPrefab;
    [SerializeField]
    CameraTracker _playerTracker;

    List<Player> _players = new List<Player>();
    InputPlayer _controlledPlayer;

    /// <summary>
    /// Get all the players on the map
    /// </summary>
    public List<Player> Players
    {
        get { return _players; }
    }

    /// <summary>
    /// Get the current controlled player
    /// </summary>
    public InputPlayer ControlledPlayer
    {
        get { return _controlledPlayer; }
    }

    /// <summary>
    /// Spawn a controlled player
    /// </summary>
    public void SpawnControlledPlayer()
    {
        if (_controlledPlayer != null) return;
        GameObject newControlledPlayer = Instantiate(_controlledPlayerPrefab);
        _controlledPlayer = newControlledPlayer.GetComponent<InputPlayer>();
        _playerTracker.TrackedObject = _controlledPlayer.transform;
        _players.Add(_controlledPlayer);
    }

    /// <summary>
    /// Remove a player from the list of player on the map
    /// </summary>
    /// <param name="player">The player to remove (controlled or bot)</param>
    public void RemovePlayer(Player player)
    {
        if (player.IsControlled)
        {
            _controlledPlayer = null;
            _playerTracker.TrackedObject = null;
        }
        _players.Remove(player);
    }
}
