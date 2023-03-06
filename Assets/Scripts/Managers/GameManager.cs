using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

[RequireComponent(typeof(HexaGrid))]
[RequireComponent(typeof(PlayersManager))]
[RequireComponent(typeof(ObjectsManager))]
public class GameManager : MonoBehaviour
{
    /// <summary>
    /// Get the GameManager Singleton
    /// </summary>
    public static GameManager Instance;

    /// <summary>
    /// The hexagrid unique instance
    /// </summary>
    public HexaGrid HexaGrid { get => _hexaGrid; }

    /// <summary>
    /// Get the players manager
    /// </summary>
    public PlayersManager Players { get => _players; }

    /// <summary>
    /// Get the objects manager / spawner
    /// </summary>
    public ObjectsManager ObjectsManager { get => _objectsManager; }

    HexaGrid _hexaGrid;
    PlayersManager _players;
    ObjectsManager _objectsManager;

    /// <summary>
    /// Start or Restart a new game
    /// </summary>
    public void RestartGame()
    {
        _hexaGrid.Clear(); 
        _objectsManager.CanSpanwObjects = true;
        _players.SpawnControlledPlayer();
        _players.CanSpawnBots = true;
    }

    /// <summary>
    /// Call when a player has no more base and will be destroyed
    /// </summary>
    public void OnPlayerDestroyed(Player playerDestroyed)
    {
        if (playerDestroyed.IsControlled) GameOver();
        _players.RemovePlayer(playerDestroyed);
    }

    private void Awake()
    {
        Instance = this;
        _hexaGrid = GetComponent<HexaGrid>();
        _players = GetComponent<PlayersManager>();
        _objectsManager = GetComponent<ObjectsManager>();
        _hexaGrid.Generate();
    }

    private void Start()
    {
        RestartGame();
    }

    private void GameOver()
    {
        _objectsManager.CanSpanwObjects = false;
        _players.CanSpawnBots = false;
        _hexaGrid.Clear();
        Debug.Log("GameOver!");
    }
}
