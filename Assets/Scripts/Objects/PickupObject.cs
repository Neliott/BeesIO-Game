using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class PickupObject : PlacableObject
{
    /// <summary>
    /// Pickup the object
    /// </summary>
    public abstract void PickUp();
    /// <summary>
    /// Drop the object
    /// </summary>
    public abstract void Drop();
}
