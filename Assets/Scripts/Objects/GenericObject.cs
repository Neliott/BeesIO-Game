using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GenericObject : MonoBehaviour, IPlacableObject
{
    /// <inheritdoc/>
    public void OnDestroyNeeded()
    {
        Destroy(gameObject);
    }

    /// <inheritdoc/>
    public void OnPlaced(){}
}
