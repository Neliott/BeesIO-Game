using System;
using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEditor;
using UnityEngine;
using UnityEngine.TestTools;

public class MoverTest
{
    const float TEST_WAIT_TIME = 1f;
    //Needed to approximate the position (caused by deltaTime / frame duration of mover)
    const int DIGITS_POSITION_TOLERANCE = 1;

    [UnityTest]
    public IEnumerator Mover_DontMove_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = Vector3.zero;
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 0;
        mover.Direction = 0;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);
        Vector3 actualPosition = mover.transform.position;
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }

    #region Direction Tests
    [UnityTest]
    public IEnumerator Mover_MoveUp_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(1, 0, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 1;
        mover.Direction = 0;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveDown_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(-1, 0, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 1;
        mover.Direction = 180;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveLeft_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(0, -1, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 1;
        mover.Direction = -90;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveRight_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(0, 1, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 1;
        mover.Direction = 90;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveUpRight_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(0.7f, 0.7f, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 1;
        mover.Direction = 45;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveDownLeft_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(-0.7f, -0.7f, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 1;
        mover.Direction = 225;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    #endregion
    #region Speed Tests
    [UnityTest]
    public IEnumerator Mover_MoveSlow_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(0.5f, 0, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 0.5f;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveFast_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(5f, 0, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Speed = 5f;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveSlowDiagonal_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(0.4f,0.4f, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Direction = 45;
        mover.Speed = 0.5f;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    [UnityTest]
    public IEnumerator Mover_MoveFastDiagonal_PositionEquals()
    {
        //Given
        Vector3 expectedPosition = new Vector3(3.5f,3.5f, 0);
        Mover mover = SpawnMoverPlayer();
        mover.Direction = 45;
        mover.Speed = 5f;
        //When
        yield return new WaitForSecondsRealtime(TEST_WAIT_TIME);//Testing update of Mover
        Vector3 actualPosition = GetApproximatePosition(mover.transform);
        //Then
        Assert.AreEqual(expectedPosition, actualPosition);
    }
    #endregion

    Mover SpawnMoverPlayer()
    {
        GameObject gm = new GameObject();
        Mover mover = gm.AddComponent<Mover>();
        return mover;
    }
    Vector3 GetApproximatePosition(Transform moverTransform)
    {
        return new Vector3((float)Math.Round(moverTransform.position.x, DIGITS_POSITION_TOLERANCE), (float)Math.Round(moverTransform.position.y, DIGITS_POSITION_TOLERANCE), 0);
    }
}
