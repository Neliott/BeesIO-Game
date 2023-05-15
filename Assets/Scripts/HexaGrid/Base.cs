using Network;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using Random = UnityEngine.Random;

public class Base : MonoBehaviour
{
    /// <summary>
    /// Get the current score base
    /// </summary>
    public int Score
    {
        get { return _currentHexagones.Count; }
    }

    /// <summary>
    /// Get the color of the base
    /// </summary>
    public Color Color
    {
        get { return _color; }
    }

    /// <summary>
    /// Event triggered when the base has no remaning hexagons
    /// </summary>
    //public event Action OnBaseDestroyed;

    [SerializeField]
    TextMesh _playerName;
    List<Vector2Int> _currentHexagones = new List<Vector2Int>();
    Color _color;


    /// <summary>
    /// Setup the base
    /// </summary>
    /// <param name="fixedAttributes">Spawn attributes from the player</param>
    public void Setup(NetworkPlayerFixedAttributes fixedAttributes)
    {
        _playerName.text = fixedAttributes.name;
        _color = Color.HSVToRGB(fixedAttributes.colorHue / 360f, 1, 1f);
    }

    /// <summary>
    /// Get the nearest valid position to place a new hexagon on the base
    /// </summary>
    /// <param name="position">The target position</param>
    /// <returns>The nearest valid position</returns>
    /*public Vector2 GetNearestValidPlacablePosition(Vector2 position)
    {
        float minDistance = float.MaxValue;
        Vector2 nearestPosition = Vector2.zero;
        foreach (Vector2Int hexagon in _currentHexagones)
        {
            Vector2 hexagonPosition = HexaGrid.HexIndexesToWorldPosition(hexagon);
            float distance = Vector2.Distance(position, hexagonPosition);
            if (distance < minDistance)
            {
                minDistance = distance;
                nearestPosition = hexagonPosition;
            }
        }
        return nearestPosition;
    }*/
    
    /// <summary>
    /// Make checks when the list of owned hexagones changes
    /// </summary>
    public void OnHexagonOwnedListChanged()
    {
        _currentHexagones = GameManager.Instance.HexaGrid.GetHexagonsOfBase(this);
        GameManager.Instance.UIManager.Scoreboard.UpdateScores();
    }
}
