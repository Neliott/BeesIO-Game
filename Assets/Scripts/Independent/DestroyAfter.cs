using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DestroyAfter : MonoBehaviour
{
    [SerializeField]
    float _seconds = 5;

    void Start()
    {
        Destroy(gameObject, _seconds);
    }
}
