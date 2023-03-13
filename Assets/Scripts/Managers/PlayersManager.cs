using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayersManager : MonoBehaviour
{

    const int BOTS_TARGET_NUMBER = 20;
    const float SPAWN_BOTS_RATE = 0.1f;

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
    /// Can the player manager spawn bots ?
    /// </summary>
    public bool CanSpawnBots
    {
        get { return _canSpawnBots; }
        set {
            _canSpawnBots = value;
            if (_canSpawnBots) StartSpawnBots();
        }
    }

    [SerializeField] GameObject _controlledPlayerPrefab;
    [SerializeField] GameObject _botPlayerPrefab;
    [SerializeField] CameraTracker _playerTracker;

    List<Player> _players = new List<Player>();
    InputPlayer _controlledPlayer;
    float _clock = 0;
    bool _canSpawnBots;

    /// <summary>
    /// Spawn a controlled player
    /// </summary>
    public void SpawnControlledPlayer()
    {
        if (_controlledPlayer != null) return;
        GameObject newControlledPlayer = Instantiate(_controlledPlayerPrefab);
        _controlledPlayer = newControlledPlayer.GetComponent<InputPlayer>();
        _controlledPlayer.Setup(GameManager.Instance.UIManager.GetName());
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

    void StartSpawnBots()
    {
        for (int i = 0; i < BOTS_TARGET_NUMBER; i++)
        {
            SpawnBot();
        }
    }
    void SpawnBot()
    {
        GameObject newBotPlayerGameObject = Instantiate(_botPlayerPrefab, HexaGrid.GetRandomPlaceOnMap(),Quaternion.identity);
        BotPlayer newBotPlayer = newBotPlayerGameObject.GetComponent<BotPlayer>();
        newBotPlayer.Setup("Bot#"+Random.Range(0,100));
        _players.Add(newBotPlayer);
    }
    void Update()
    {
        if (!_canSpawnBots) return;
        _players.RemoveAll(item => item == null);
        if ((_players.Count - 1) >= BOTS_TARGET_NUMBER) return;

        _clock = _clock + Time.deltaTime;
        if (_clock > 1 / SPAWN_BOTS_RATE)
        {
            _clock = 0;
            SpawnBot();
        }
    }
}
