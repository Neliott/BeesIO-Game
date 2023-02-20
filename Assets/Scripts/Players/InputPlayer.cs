using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputPlayer : Player
{
    const float SMOOTH_DIRECTION = 20;
    /// <inheritdoc/>
    public override bool IsControlled => true;

    Camera _cameraReference;
    float velocity;

    /// <inheritdoc/>
    public override void Setup()
    {
        base.Setup();
       _cameraReference = Camera.main;
    }

    void Update()
    {
        //This is used cause the player in not always perfectly in the center of the view (caused by the position lerping of the CameraTracker)
        Vector3 objectPositionInPixels = _cameraReference.WorldToScreenPoint(transform.position);
        //The mouse relative pixels difference from the player
        Vector3 mouseRelativePosition = Input.mousePosition - objectPositionInPixels;
        //Convert the mouse relative vector to an angle
        float angle = Mathf.Atan2(mouseRelativePosition.y, mouseRelativePosition.x) * Mathf.Rad2Deg;
        //The direction is smoothed
        float smothAngle = Mathf.SmoothDampAngle(_mover.Direction, angle, ref velocity, SMOOTH_DIRECTION*Time.deltaTime);
        _mover.Direction = smothAngle;
    }
}
