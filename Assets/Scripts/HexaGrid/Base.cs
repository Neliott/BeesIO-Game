using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Random = UnityEngine.Random;

public class Base : MonoBehaviour
{
    const int DEFAULT_BASE_SIZE = 2;

    /// <summary>
    /// Event triggered when the base has no remaning hexagons
    /// </summary>
    public event Action OnBaseDestroyed;

    [SerializeField]
    TextMesh _playerName;

    Color _color;
    Vector2Int _baseCenterIndex;
    int _baseLevel;
    List<Vector2Int> _remaningHexagonsForNextStep = new List<Vector2Int>();

    /// <summary>
    /// The color of the base
    /// </summary>
    public Color Color
    {
        get { return _color; }
        set { _color = value; }
    }
    /// <summary>
    /// Setup the base with the player's name
    /// </summary>
    /// <param name="name">The name of the owner of the base</param>
    public void Setup(string name)
    {
        _color = Random.ColorHSV(0, 1, 1, 1, 1, 1);
        _playerName.text = name;
        _baseCenterIndex = GameManager.Instance.HexaGrid.WordPositionToHexIndexes(transform.position);
        FillBase(DEFAULT_BASE_SIZE);
        _baseLevel = DEFAULT_BASE_SIZE;
    }

    /// <summary>
    /// Upgrade the base with a amount of points
    /// </summary>
    /// <param name="points">The number of new hexagons to add to the base</param>
    public void Upgrade(int points)
    {
        if(_remaningHexagonsForNextStep.Count == 0)
        {
            _baseLevel++;
            _remaningHexagonsForNextStep = GameManager.Instance.HexaGrid.GetBigHexagonPositions(_baseCenterIndex, _baseLevel, true);
        }
        GameManager.Instance.HexaGrid.SetHexagonProperty(_remaningHexagonsForNextStep[0], this);
        _remaningHexagonsForNextStep.RemoveAt(0);
    }
    /// <summary>
    /// Destroy the base (called when there is no more hexagons)
    /// </summary>
    public void OnHexagonOwnedListChanged()
    {
        List<Vector2Int> hexagons = GameManager.Instance.HexaGrid.GetHexagonsOfBase(this);
        if (hexagons.Count == 0)
        {
            DestroyBase();
        }
        else
        {
            //TODO : 
        }
    }

    void DestroyBase()
    {
        OnBaseDestroyed?.Invoke();
        Destroy(gameObject);
    }

    void FillBase(int radius)
    {
        List<Vector2Int> basePosition = GameManager.Instance.HexaGrid.GetBigHexagonPositions(_baseCenterIndex, radius, false);
        foreach (var position in basePosition)
        {
            GameManager.Instance.HexaGrid.SetHexagonProperty(position, this);
        }
    }
}
