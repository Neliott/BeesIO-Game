using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BotPlayer : Player
{
    const float SMOOTH_DIRECTION = 20;

    /// <inheritdoc/>
    public override bool IsControlled => false;

    MonoBehaviour _target;
    float _velocity;

    void ChooseNewTarget()
    {
        float randomPercentage = Random.Range(0, 1f);
        if (randomPercentage < 0.01f)
        {
            _target = GameManager.Instance.ObjectsManager.GetRandomObject<Flower>();
        }
        else
        {
            _target = GameManager.Instance.ObjectsManager.GetRandomObject<Pesticide>();
        }
    }

    void Update()
    {
        if(_target == null)
        {
            ChooseNewTarget();
            return;
        }

        List<PickupObject> pickedObjects = _pickupController.GetPickedUpObjects();
        if (pickedObjects.Count != 0 && !(_target is Base))
        {
            if (pickedObjects[0] is Pollen) _target = _base;
            if (pickedObjects[0] is Pesticide) _target = GetNearestOtherBase();
        }

        Move(_target.transform.position);
        if(Vector3.Distance(transform.position, _target.transform.position) < .5f)
        {
            if (_target is Base && pickedObjects.Count != 0)
            {
                _pickupController.Drop();
            }
            ChooseNewTarget();
        }

        PickupObject pickup = _pickupController.GetCompatiblePickableObject();
        if (pickup != null)
        {
            _pickupController.PickupLastObject();
        }
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
