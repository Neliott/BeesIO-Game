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

    void ChooseNewTarget()
    {
        float randomPercentage = Random.Range(0, 1f);
        if (randomPercentage < PASSIVITY)
        {
            _target = GetNearObject<Flower>();
            if (_target == null) _target = GetNearObject<Pollen>();
        }
        else
        {
            _target = GetNearObject<Pesticide>();
        }
    }

    void Update()
    {
        if (_target == null || (_target is PickupObject && ((PickupObject)_target).Owner != _pickupController))
        {
            ChooseNewTarget();
            return;
        }
        
        Vector3 targetWorldPosition = (_target is Base) ? _lastCachedBasePosition : _target.transform.position;
        
        Move(targetWorldPosition);
        CheckTargetAccomplishement(targetWorldPosition);
        TryToPickup();
    }

    void Move(Vector3 targetWorldPosition)
    {
        Vector3 targetRelativeDirection = targetWorldPosition-transform.position;
        //Convert the target direction relative vector to an angle
        float angle = Mathf.Atan2(targetRelativeDirection.y, targetRelativeDirection.x) * Mathf.Rad2Deg;
        //The direction is smoothed
        float smothAngle = Mathf.SmoothDampAngle(_mover.Direction, angle, ref _velocity, SMOOTH_DIRECTION * Time.deltaTime);
        _mover.Direction = smothAngle;
    }
    
    void CheckTargetAccomplishement(Vector3 targetWorldPosition)
    {
        float distanceFromTarget = Vector3.Distance(transform.position, targetWorldPosition);
        if (distanceFromTarget < DROP_DISTANCE_TOLERANCE)
        {
            if (_target is Base && _pickupController.GetPickedUpObjects().Count != 0)
            {
                _pickupController.Drop();
            }
            ChooseNewTarget();
        }
    }
    
    void TryToPickup()
    {
        PickupObject pickup = _pickupController.GetCompatiblePickableObject();
        if (pickup != null)
        {
            _pickupController.PickupLastObject();

            float randomPercentage = Random.Range(0, 1f);
            if (randomPercentage > RISK)
            {
                if (pickup is Pollen) _target = _base;
                if (pickup is Pesticide) _target = GetNearestOtherBase();
                _lastCachedBasePosition = ((Base)_target).GetNearestValidPlacablePosition(transform.position);
            }
            else
            {
                if (pickup is Pollen)
                    _target = GetNearObject<Pollen>();
                if (pickup is Pesticide)
                    _target = GetNearObject<Pesticide>();
            }
        }
    }

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
    
    PlacableObject GetNearObject<T>() where T : PlacableObject
    {
        List<PlacableObject> objectsByDistance = GameManager.Instance.ObjectsManager.GetSpawnedObjectsByType<T>().OrderBy(point => Vector3.Distance(transform.position, point.transform.position)).ToList();
        for (int i = Mathf.Min(objectsByDistance.Count, NEAR_OBJECT_ERROR) - 1; i < objectsByDistance.Count; i++)
        {
            PlacableObject objectToTest = objectsByDistance[i];
            if (objectToTest is PickupObject && ((PickupObject)objectToTest).Owner != null) continue;
            if (objectToTest is Flower && (((Flower)objectToTest).HasPollen() == false)) continue;
            return objectToTest;
        }
        return null;
    }
}
