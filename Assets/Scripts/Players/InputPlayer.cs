using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputPlayer : Player
{
    const float SMOOTH_DIRECTION = 20;
    /// <inheritdoc/>
    public override bool IsControlled => true;

    float velocity;

    public override void Setup(string name)
    {
        base.Setup(name);
        StartCoroutine(AddTest());
    }

    IEnumerator AddTest()
    {
        while (true)
        {
            yield return new WaitForSeconds(1);
            _base.Upgrade(1);
        }
    }
    void RemoveTest()
    {
        Vector2Int hexindex = GameManager.Instance.HexaGrid.WordPositionToHexIndexes(transform.position);
        GameManager.Instance.HexaGrid.SetHexagonProperty(hexindex, null);
    }

    void Update()
    {
        //The mouse relative pixels difference from the player
        Vector3 mouseRelativePosition = Input.mousePosition - new Vector3(Screen.width / 2,Screen.height / 2,0);
        //Convert the mouse relative vector to an angle
        float angle = Mathf.Atan2(mouseRelativePosition.y, mouseRelativePosition.x) * Mathf.Rad2Deg;
        //The direction is smoothed
        float smothAngle = Mathf.SmoothDampAngle(_mover.Direction, angle, ref velocity, SMOOTH_DIRECTION*Time.deltaTime);
        _mover.Direction = smothAngle;
        RemoveTest();
    }

    protected override void OnBaseDestroyed()
    {
        GameManager.Instance.GameOver();
        base.OnBaseDestroyed();
    }
}