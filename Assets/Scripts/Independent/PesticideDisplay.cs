using UnityEngine;

public class PesticideDisplay : MonoBehaviour
{
    const float SECONDS_BEFORE_EXPLOSION = 10;

    [SerializeField]
    TextMesh _explosionCountDown;

    float _clockBeforeExplosion = SECONDS_BEFORE_EXPLOSION;
    float _clockBeforeExplosionRound = SECONDS_BEFORE_EXPLOSION;
    bool _isClockTicking = false;

    /// <summary>
    /// Start the pesticide bomb
    /// </summary>
    public void StartTicking()
    {
        _isClockTicking = true;
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
    }
}