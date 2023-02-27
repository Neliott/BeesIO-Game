using System.Collections;
using System.Collections.Generic;
using UnityEngine;

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

        _pickedUpObjects.Add(objectToPickup);
        _currentObjectToPickup.Remove(objectToPickup);
        //TODO : Pickup bind 
    }

    /// <summary>
    /// Drop all picked up objects
    /// </summary>
    public void Drop()
    {
        _pickedUpObjects.Clear();
        //TODO : Drop 
    }

    /// <summary>
    /// Get the last compatible object added to the list CurrentObjectToPickup
    /// </summary>
    /// <returns>The object or null</returns>
    public PickupObject GetCompatiblePickableObject()
    {
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

    private void OnTriggerEnter2D(Collider2D collision)
    {
        PickupObject pickupObject = collision.GetComponent<PickupObject>();
        if (pickupObject == null || _currentObjectToPickup.Contains(pickupObject) || _pickedUpObjects.Contains(pickupObject)) return;
        _currentObjectToPickup.Add(pickupObject);
    }
    private void OnTriggerExit2D(Collider2D collision)
    {
        PickupObject pickupObject = collision.GetComponent<PickupObject>();
        if (pickupObject == null) return;
        _currentObjectToPickup.Remove(pickupObject);
    }
}
