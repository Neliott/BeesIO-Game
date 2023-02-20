using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Mover : MonoBehaviour
{
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
    }
}
