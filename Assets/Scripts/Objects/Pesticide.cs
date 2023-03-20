using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pesticide : PickupObject
{
    const int MINIMUM_RADIUS = 2;
    const int MAXIMUM_RADIUS = 4;
    const float SECONDS_BEFORE_EXPLOSION = 10;

    [SerializeField]
    TextMesh _explosionCountDown;
    [SerializeField]
    GameObject _explosionEffect;

    float _clockBeforeExplosion = SECONDS_BEFORE_EXPLOSION;
    float _clockBeforeExplosionRound = SECONDS_BEFORE_EXPLOSION;
    bool _isClockTicking = false;

    /// <summary>
    /// Drop the pesticide and start the clock
    /// </summary>
    public override void Drop()
    {
        if (_owner == null) return; //Todo : Fix owner null
        _isClockTicking = true;
        base.Drop();
    }

    private void Update()
    {
        if (!_isClockTicking || _clockBeforeExplosion < 0) return;
        _clockBeforeExplosion = _clockBeforeExplosion - Time.deltaTime;
        float clockRounded = Mathf.Round(_clockBeforeExplosion);
        if (clockRounded != _clockBeforeExplosionRound)
        {
            _clockBeforeExplosionRound = clockRounded; 
            _explosionCountDown.text = "" + clockRounded;
        }
        if (_clockBeforeExplosion < 0) Explode();
    }
    void Explode()
    {
        Vector2Int center = HexaGrid.WordPositionToHexIndexes(transform.position);
        int radius = Random.Range(MINIMUM_RADIUS, MAXIMUM_RADIUS);
        List<Vector2Int> allHexsToExplode = HexaGrid.GetBigHexagonPositions(center, radius, false);
        GameManager.Instance.HexaGrid.SetHexagonsProperty(allHexsToExplode, null);
        GameObject effect = Instantiate(_explosionEffect, transform.position, Quaternion.identity);
        effect.transform.localScale = radius * Vector3.one * 1.5f;
        OnDestroyNeeded();
    }
}