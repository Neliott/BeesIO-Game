using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Destroy a gameobject after a defined amount of time
/// </summary>
public class DestroyAfter : MonoBehaviour
{
    [SerializeField] float _seconds = 5;

    void Start()
    {
        Destroy(gameObject, _seconds);
    }
}
