using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class BotPlayer : Player
{
    const float SMOOTH_DIRECTION = 10;
    const float DROP_DISTANCE_TOLERANCE = .35f;
    const int NEAR_OBJECT_ERROR = 2;
    const float BASE_PESTICIDE_RISK_RADIUS = 7f;

    /// <inheritdoc/>
    public override bool IsControlled => false;

    MonoBehaviour _target;
    float _velocity;
    Vector2 _lastCachedBasePosition;
    float _passivity;
    float _risk;

    public override void Setup(string name)
    {
        base.Setup(name);
        _passivity = Random.Range(0.3f, 0.8f);
        _risk = Random.Range(0.3f, 0.9f);
    }

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
        if (_target is PickupObject && (((PickupObject)_target).Owner != null) && ((PickupObject)_target).Owner != _pickupController) return true;

        //The flower target has no more pollen
        if (_target is Flower && ((Flower)_target).HasPollen() == false) return true;

        return false;
    }

    /// <summary>
    /// Choose a new target based on the general state of the bot
    /// </summary>
    void ChooseNewTarget()
    {
        List<PickupObject> pickedUpObjects = _pickupController.GetPickedUpObjects();

        //Check if the base is in danger (take the pesticide out of base)
        Pesticide potentialDanger = PesticideEndangeringBase();
        if (potentialDanger != null)
        {
            _target = potentialDanger;
            //Drop objects if they are not Pesticide
            if (pickedUpObjects.Count > 0 && !(pickedUpObjects[0] is Pesticide)) _pickupController.Drop();
            return;
        }

        //Get a random percentage to randomize next decisions
        float randomPercentage = Random.Range(0, 1f);

        if (pickedUpObjects.Count > 0)
        {
            //Calculate the risk for choosing what to do (with objects pickedup)
            if (randomPercentage > _risk)
            {
                //Go to a base depending on the type of object
                if (pickedUpObjects[0] is Pollen) _target = _base;
                //if (pickedUpObjects[0] is Pesticide) _target = GetNearestOtherBase();
                //Using cached positions to not compute the NearestValidPlacablePosition at every frames
                //_lastCachedBasePosition = ((Base)_target).GetNearestValidPlacablePosition(transform.position);
            }
            else
            {
                //Go to search more similar objects
                if (pickedUpObjects[0] is Pollen)
                    _target = GetNearObject<Pollen>();
                if (pickedUpObjects[0] is Pesticide)
                    _target = GetNearObject<Pesticide>();
            }
            return;
        }

        //Choose a new strategy
        if (randomPercentage < _passivity)
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
            ChooseNewTarget();
        }
    }

    /// <summary>
    /// Get the nearest base of an other player
    /// </summary>
    /// <returns>The nearest base found</returns>
    /*Base GetNearestOtherBase()
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
    }*/

    /// <summary>
    /// Return a pesticide if he is in the BASE_PESTICIDE_RISK_RADIUS
    /// </summary>
    /// <returns>Return a problematic pesticide for the base or null is not found in the radius</returns>
    Pesticide PesticideEndangeringBase()
    {
        List<PlacableObject> pesticides = GameManager.Instance.ObjectsManager.GetSpawnedObjectsByType<Pesticide>();
        foreach (var pesticideToTest in pesticides)
        {
            if (Vector3.Distance(_base.transform.position, pesticideToTest.transform.position) > BASE_PESTICIDE_RISK_RADIUS) continue;
            if (((Pesticide)pesticideToTest).Owner != null) continue;
            return (Pesticide)pesticideToTest;
        }
        return null;
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
