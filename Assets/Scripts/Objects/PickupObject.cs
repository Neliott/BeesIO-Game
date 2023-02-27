using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Collider2D))]
public class PickupObject : PlacableObject
{
    private PickupController _owner = null;

    /// <summary>
    /// Get the owner of this object (or null)
    /// </summary>
    public PickupController Owner
    {
        get { return _owner; }
    }

    /// <summary>
    /// Pickup the object
    /// </summary>
    public void PickUp(PickupController newOwner)
    {
        if (_owner != null) return;
        transform.localScale = Vector3.one * 0.5f;
        _owner = newOwner;
    }

    /// <summary>
    /// Drop the object
    /// </summary>
    public void Drop()
    {
        if (_owner == null) return;
        transform.localScale = Vector3.one;
        _owner = null;
    }
}
