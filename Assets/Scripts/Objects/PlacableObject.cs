using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlacableObject : MonoBehaviour
{
    /// <summary>
    /// When the object has been placed
    /// </summary>
    public virtual void OnPlaced()
    {

    }
    /// <summary>
    /// When the object must be destroyed
    /// </summary>
    public virtual void OnDestroyNeeded()
    {
        Destroy(gameObject);
    }
}
