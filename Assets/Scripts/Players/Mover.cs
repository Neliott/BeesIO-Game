using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Mover : MonoBehaviour
{
    const int ZONE_EXCEEDING_TOLERANCE = 3;
    const float MAX_X_POSITION = (((HexaGrid.MAP_SAFE_GRID_PERCENTAGE - 0.5f) * HexaGrid.MAP_WIDTH) + ZONE_EXCEEDING_TOLERANCE) * HexaGrid.SPACING_WIDTH;
    const float MAX_Y_POSITION = (((HexaGrid.MAP_SAFE_GRID_PERCENTAGE - 0.5f) * HexaGrid.MAP_HEIGHT) + ZONE_EXCEEDING_TOLERANCE) * HexaGrid.SPACING_HEIGHT;
    /// <summary>
    /// The speed of the mover
    /// </summary>
    public float Speed
    {
        get { return _speed; }
        set { _speed = value; }
    }

    /// <summary>
    /// The direction of the player (in degrees, 0° is the top)
    /// </summary>
    public float Direction
    {
        get { return _direction; }
        set { _direction = value; }
    }

    float _speed = 0;
    float _direction = 0;

    void Update()
    {
        if (_speed == 0) return;
        transform.rotation = Quaternion.Euler(new Vector3(0, 0, _direction));
        transform.position += transform.right * _speed * Time.deltaTime;
        transform.position = GetPositionInsideMapBounds(transform.position);
    }
    Vector2 GetPositionInsideMapBounds(Vector2 position)
    {
        if (position.x > MAX_X_POSITION)
        {
            position.x = MAX_X_POSITION;
        }else if (position.x < -MAX_X_POSITION)
        {
            position.x = -MAX_X_POSITION;
        }

        if (position.y > MAX_Y_POSITION)
        {
            position.y = MAX_Y_POSITION;
        }else if (position.y < -MAX_Y_POSITION)
        {
            position.y = -MAX_Y_POSITION;
        }
        return position;
    }
}
