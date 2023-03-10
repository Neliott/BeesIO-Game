using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class BotPlayer : Player
{
    const float SMOOTH_DIRECTION = 20;
    const float DROP_DISTANCE_TOLERANCE = .35f;
    const float PASSIVITY = 0.6f;
    const float RISK = 0.5f;
    const int NEAR_OBJECT_ERROR = 2;


    /// <inheritdoc/>
    public override bool IsControlled => false;

    MonoBehaviour _target;
    float _velocity;
    Vector2 _lastCachedBasePosition;

    void Update()
    {
        if (IsNeedingANewTarget())
        {
            ChooseNewTarget();
            return;
        }

        //The target position is not necesarry it's transform position (ex : a base has a closer valid point) 
        Vector3 targetWorldPosition = (_target is Base) ? _lastCachedBasePosition : _target.transform.position;
        
        Move(targetWorldPosition);
        CheckTargetAccomplishement(targetWorldPosition);
        TryToPickup();
    }

    /// <summary>
    /// Is the current target expired or not valid ? Do we need to choose an other ?
    /// </summary>
    /// <returns>True if the target need to be changed</returns>
    bool IsNeedingANewTarget()
    {
        if (_target == null) return true;

        //The target pickup object has a owner
        if (_target is PickupObject && ((PickupObject)_target).Owner != _pickupController) return true;

        //The flower target has no more pollen
        if (_target is Flower && ((Flower)_target).HasPollen() == false) return true;

        return false;
    }

    /// <summary>
    /// Choose a random new target
    /// </summary>
    void ChooseNewTarget()
    {
        float randomPercentage = Random.Range(0, 1f);
        if (randomPercentage < PASSIVITY)
        {
            _target = GetNearObject<Flower>();
            //If no compatible flowers found, go to single pollen units
            if (_target == null) _target = GetNearObject<Pollen>();
        }
        else
        {
            _target = GetNearObject<Pesticide>();
        }
    }

    /// <summary>
    /// Change direction to match the target direction
    /// </summary>
    /// <param name="targetWorldPosition">The target to move to</param>
    void Move(Vector3 targetWorldPosition)
    {
        Vector3 targetRelativeDirection = targetWorldPosition-transform.position;

        //Convert the target direction relative vector to an angle
        float angle = Mathf.Atan2(targetRelativeDirection.y, targetRelativeDirection.x) * Mathf.Rad2Deg;

        //The direction is smoothed
        float smothAngle = Mathf.SmoothDampAngle(_mover.Direction, angle, ref _velocity, SMOOTH_DIRECTION * Time.deltaTime);
        _mover.Direction = smothAngle;
    }

    /// <summary>
    /// Check if the target is reached
    /// </summary>
    /// <param name="targetWorldPosition">The target real world position</param>
    void CheckTargetAccomplishement(Vector3 targetWorldPosition)
    {
        float distanceFromTarget = Vector3.Distance(transform.position, targetWorldPosition);
        if (distanceFromTarget < DROP_DISTANCE_TOLERANCE)
        {
            //Drop current objects if target is a base
            if (_target is Base && _pickupController.GetPickedUpObjects().Count != 0)
            {
                _pickupController.Drop();
            }
            ChooseNewTarget();
        }
    }
    
    /// <summary>
    /// Try to pickup any objects compatible on the current position
    /// </summary>
    void TryToPickup()
    {
        PickupObject pickup = _pickupController.GetCompatiblePickableObject();
        if (pickup != null)
        {
            _pickupController.PickupLastObject();

            //Calculate the risk to choose what to do next
            float randomPercentage = Random.Range(0, 1f);
            if (randomPercentage > RISK)
            {
                //Go to a base depending on the type of object
                if (pickup is Pollen) _target = _base;
                if (pickup is Pesticide) _target = GetNearestOtherBase();
                //Using cached positions to not compute the NearestValidPlacablePosition at every frames
                _lastCachedBasePosition = ((Base)_target).GetNearestValidPlacablePosition(transform.position);
            }
            else
            {
                //Go to search more similar objects
                if (pickup is Pollen)
                    _target = GetNearObject<Pollen>();
                if (pickup is Pesticide)
                    _target = GetNearObject<Pesticide>();
            }
        }
    }

    /// <summary>
    /// Get the nearest base of an other player
    /// </summary>
    /// <returns>The nearest base found</returns>
    Base GetNearestOtherBase()
    {
        float minDistance = Mathf.Infinity;
        Base nearestBase = null;
        foreach (Player player in GameManager.Instance.Players.Players)
        {
            if (player != this)
            {
                float baseDistance = Vector3.Distance(transform.position, player.Base.transform.position);
                if (baseDistance < minDistance)
                {
                    minDistance = baseDistance;
                    nearestBase = player.Base;
                }
            }
        }
        return nearestBase;
    }

    /// <summary>
    /// Get a object of a given type that is near (not necessary the nearest to randomise the behavior)
    /// </summary>
    /// <typeparam name="T">The type of object targetted</typeparam>
    /// <returns>The object found or null if no matches</returns>
    PlacableObject GetNearObject<T>() where T : PlacableObject
    {
        //Get the list of objects by the distance
        List<PlacableObject> objectsByDistance = GameManager.Instance.ObjectsManager.GetSpawnedObjectsByType<T>().OrderBy(point => Vector3.Distance(transform.position, point.transform.position)).ToList();
        
        //Start to search the object with a NEAR_OBJECT_ERROR index
        for (int i = Mathf.Min(objectsByDistance.Count, NEAR_OBJECT_ERROR) - 1; i < objectsByDistance.Count; i++)
        {
            //Determine if the object is compatible (no owner and interest)
            PlacableObject objectToTest = objectsByDistance[i];
            if (objectToTest is PickupObject && ((PickupObject)objectToTest).Owner != null) continue;
            if (objectToTest is Flower && (((Flower)objectToTest).HasPollen() == false)) continue;
            return objectToTest;
        }
        return null;
    }
}
