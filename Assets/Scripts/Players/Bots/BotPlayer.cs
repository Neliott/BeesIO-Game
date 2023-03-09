using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BotPlayer : Player
{
    const float SMOOTH_DIRECTION = 20;
    const float DROP_DISTANCE_TOLERANCE = .35f;

    /// <inheritdoc/>
    public override bool IsControlled => false;

    MonoBehaviour _target;
    float _velocity;
    Vector2 _lastCachedBasePosition;

    void ChooseNewTarget()
    {
        float randomPercentage = Random.Range(0, 1f);
        if (randomPercentage < 0.7f)
        {
            if (Random.Range(0, 1f) < 0.9) _target = GameManager.Instance.ObjectsManager.GetNearestObject<Flower>(transform.position);
            else _target = GameManager.Instance.ObjectsManager.GetRandomObject<Flower>();
        }
        else
        {
            if (Random.Range(0, 1f) < 0.9) _target = GameManager.Instance.ObjectsManager.GetNearestObject<Pesticide>(transform.position);
            else _target = GameManager.Instance.ObjectsManager.GetRandomObject<Pesticide>();
        }
    }

    void Update()
    {
        if (_target == null || (_target is PickupObject && ((PickupObject)_target).Owner != null && ((PickupObject)_target).Owner != _pickupController))
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
            if (!(_target is Base))
            {
                if (pickup is Pollen) _target = _base;
                if (pickup is Pesticide) _target = GetNearestOtherBase();
                _lastCachedBasePosition = ((Base)_target).GetNearestValidPlacablePosition(transform.position);
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
}
