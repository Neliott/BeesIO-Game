using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(Collider2D))]
public class PickupController : MonoBehaviour
{
    List<PickupObject> _currentObjectToPickup = new List<PickupObject>();
    List<PickupObject> _pickedUpObjects = new List<PickupObject>();

    /// <summary>
    /// Pickup the last compatible object added to the list CurrentObjectToPickup
    /// </summary>
    public void PickupLastObject()
    {
        PickupObject objectToPickup = GetCompatiblePickableObject();
        //No compatible objects found
        if (objectToPickup == null) return;

        _pickedUpObjects.Add(objectToPickup);
        _currentObjectToPickup.Remove(objectToPickup);
        objectToPickup.PickUp(this);
        objectToPickup.transform.SetParent(null);
    }

    /// <summary>
    /// Drop all picked up objects
    /// </summary>
    public void Drop()
    {
        foreach (PickupObject objectToDrop in _pickedUpObjects)
        {
            objectToDrop.Drop();
        }
        _pickedUpObjects.Clear();
    }

    /// <summary>
    /// Get the last compatible object added to the list CurrentObjectToPickup
    /// </summary>
    /// <returns>The object or null</returns>
    public PickupObject GetCompatiblePickableObject()
    {
        if (_currentObjectToPickup.Count == 0) return null;
        if (_pickedUpObjects.Count == 0)
        {
            return _currentObjectToPickup[_currentObjectToPickup.Count - 1];
        }
        else
        {
            for (int i = _currentObjectToPickup.Count - 1; i >= 0; i++)
            {
                if (_currentObjectToPickup[i].GetType() == _pickedUpObjects[0].GetType())
                {
                    return _currentObjectToPickup[i];
                }
            }
            return null;
        }
    }

    /// <summary>
    /// Get picked up objects list
    /// </summary>
    /// <returns>The list</returns>
    public List<PickupObject> GetPickedUpObjects()
    {
        return _pickedUpObjects;
    }

    private void Update()
    {
        if (_pickedUpObjects.Count == 0) return;
        for (int i = 0; i < _pickedUpObjects.Count; i++)
        {
            if (i == 0) _pickedUpObjects[i].transform.position = GetNewPosition(transform.position, _pickedUpObjects[i].transform.position);
            else _pickedUpObjects[i].transform.position = GetNewPosition(_pickedUpObjects[i - 1].transform.position, _pickedUpObjects[i].transform.position);
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        PickupObject pickupObject = collision.GetComponent<PickupObject>();
        if (pickupObject == null || _currentObjectToPickup.Contains(pickupObject) || _pickedUpObjects.Contains(pickupObject) || pickupObject.Owner != null) return;
        _currentObjectToPickup.Add(pickupObject);
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        PickupObject pickupObject = collision.GetComponent<PickupObject>();
        if (pickupObject == null) return;
        _currentObjectToPickup.Remove(pickupObject);
    }

    /// <summary>
    /// Get a new position to follow the input
    /// </summary>
    /// <param name="input">The input (like a player or a previous node)</param>
    /// <param name="currentPosition">The current position</param>
    /// <returns>The new calculated position</returns>
    /// <remarks>Based on https://processing.org/examples/follow3.html </remarks>
    Vector2 GetNewPosition(Vector2 input, Vector2 currentPosition)
    {
        Vector2 direction = input - currentPosition;
        float angle = Mathf.Atan2(direction.y, direction.x);
        float newX = input.x - (Mathf.Cos(angle) * 1);
        float newY = input.y - (Mathf.Sin(angle) * 1);
        return new Vector2(newX, newY);
    }
}
