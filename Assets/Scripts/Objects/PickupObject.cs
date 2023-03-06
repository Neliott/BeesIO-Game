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
        Debug.Log("New owner : " + newOwner.name + "on "+gameObject.name);
        _owner = newOwner;
        history.Add(newOwner);
    }
    int dropCount = 0;
    List<PickupController> history = new List<PickupController>();
    /// <summary>
    /// Drop the object
    /// </summary>
    public virtual void Drop()
    {
        // if (_owner == null) return;
        dropCount++;
        if (_owner == null)
        {
            Debug.LogError("The owner is null !!! "+dropCount);
        }
        transform.localScale = Vector3.one;
        Debug.Log("Drop : " + _owner.name+" on "+gameObject.name);
        _owner = null;
        history.Add(null);
    }
}
