using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BotPlayer : Player
{
    enum Action
    {
        None,
        DestroyEnnemyBase,
        UpgradeMyBase,
        ProtectBase,
    }

    const float SMOOTH_DIRECTION = 20;

    /// <inheritdoc/>
    public override bool IsControlled => false;

    Action _currentAction;
    PlacableObject _targetObject;
    Base _targetBase;
    float _velocity;

    public override void Setup(string name)
    {
        base.Setup(name);
        PickNewAction();
    }

    void PickNewAction()
    {
        _currentAction = (Action)Random.Range(1, 3);
        switch (_currentAction)
        {
            case Action.DestroyEnnemyBase:
                _targetBase = GetNearestOtherBase();
                _targetObject = GameManager.Instance.ObjectsManager.GetRandomObject<Pesticide>();
                break;
            case Action.UpgradeMyBase:
                _targetBase = _base;
                _targetObject = GameManager.Instance.ObjectsManager.GetRandomObject<Flower>();
                break;
            default:
                break;
        }
    }

    void Update()
    {
        Move(_targetObject.transform.position);
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
