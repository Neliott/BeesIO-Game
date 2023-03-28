using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Collider2D))]
public class PickupObject : PlacableObject
{
    protected PickupController _owner = null;

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
    public virtual void PickUp(PickupController newOwner)
    {
        if (_owner != null) return;
        transform.localScale = Vector3.one * 0.7f;
        transform.parent = null;
        _owner = newOwner;
    }
    /// <summary>
    /// Drop the object
    /// </summary>
    public virtual void Drop()
    {
        if (_owner == null) return; //Todo : fix owner null
        transform.localScale = Vector3.one;
        _owner = null;
    }
}
