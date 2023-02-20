using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class GameManager : MonoBehaviour
{
    /// <summary>
    /// Get the GameManager Singleton
    /// </summary>
    public static GameManager Instance;

    /// <summary>
    /// The the hexagrid unique instance
    /// </summary>
    public HexaGrid HexaGrid { get => _hexaGrid; }

    [SerializeField]
    HexaGrid _hexaGrid;

    public void RestartGame()
    {
        _hexaGrid.Generate();
    }

    public void GameOver()
    {
        throw new NotImplementedException();
    }

    private void Awake()
    {
        Instance = this;
    }

    private void Start()
    {
        RestartGame();
    }
}
