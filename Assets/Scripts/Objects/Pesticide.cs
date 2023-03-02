using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pesticide : PickupObject
{
    [SerializeField]
    TextMesh _explosionCountDown;

    float _clockBeforeExplosion = 10;
    bool _isClockTicking = false;

    /// <summary>
    /// Drop the pesticide and start the clock
    /// </summary>
    public override void Drop()
    {
        _isClockTicking = true;
        base.Drop();
    }

    private void Update()
    {
        if (!_isClockTicking || _clockBeforeExplosion < 0) return;
        _clockBeforeExplosion = _clockBeforeExplosion - Time.deltaTime;
        _explosionCountDown.text = Mathf.Round(_clockBeforeExplosion).ToString();
        if (_clockBeforeExplosion < 0) Explode();
    }
    void Explode()
    {
        Vector2Int center = GameManager.Instance.HexaGrid.WordPositionToHexIndexes(transform.position);
        List<Vector2Int> allHexsToExplode = GameManager.Instance.HexaGrid.GetBigHexagonPositions(center, 3, false);
        foreach (Vector2Int hexIndexToExplode in allHexsToExplode)
        {
            GameManager.Instance.HexaGrid.SetHexagonProperty(hexIndexToExplode, null);
        }
        OnDestroyNeeded();
    }
}