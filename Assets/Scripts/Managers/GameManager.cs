using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using Network;

/// <summary>
/// The game manager. A singleton of the game managing the different client parts.
/// </summary>
[RequireComponent(typeof(HexaGrid))]
[RequireComponent(typeof(PlayersManager))]
[RequireComponent(typeof(NetworkObjectsManager))]
[RequireComponent(typeof(UIManager))]
[RequireComponent(typeof(NetworkManager))]
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
    public NetworkObjectsManager ObjectsManager { get => _objectsManager; }

    /// <summary>
    /// Get the User Interface manager (HUD)
    /// </summary>
    public UIManager UIManager { get => _uiManager; }

    /// <summary>
    /// Get the network manager (transport and serialization)
    /// </summary>
    public NetworkManager NetworkManager { get => _networkManager; }

    HexaGrid _hexaGrid;
    PlayersManager _players;
    NetworkObjectsManager _objectsManager;
    UIManager _uiManager;
    NetworkManager _networkManager;

    /// <summary>
    /// Start or Restart a new game
    /// </summary>
    public void RestartGame()
    {
        _hexaGrid.Clear();
        _networkManager.Connect();
    }

    private void Awake()
    {
        Instance = this;
        _hexaGrid = GetComponent<HexaGrid>();
        _players = GetComponent<PlayersManager>();
        _objectsManager = GetComponent<NetworkObjectsManager>();
        _uiManager = GetComponent<UIManager>();
        _networkManager = GetComponent<NetworkManager>();
        _hexaGrid.Generate();
    }

    private void Start()
    {
        _uiManager.ShowNameSelection();
    }

    private void GameOver()
    {
        _hexaGrid.Clear();
        _uiManager.ShowGameOver();
    }
}
