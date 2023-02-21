using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEditor;
using UnityEngine;
using UnityEngine.TestTools;

public class HexaGridTest
{
    GameObject HexTilePrefab
    {
        get => Resources.Load<GameObject>("Prefabs/HexTile");
    }

    [Test]
    public void HexaGrid_Generate_Passes()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        //When
        hexaGrid.Generate();
        //Then
        Assert.Pass();
    }
    [Test]
    public void HexaGrid_SpacesTransformationTwoWays_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2Int expectedHexIndex = new Vector2Int(Random.Range(0, 200), Random.Range(0, 200));
        //When
        Vector2 worldPosition = hexaGrid.HexIndexesToWorldPosition(expectedHexIndex);
        Vector2Int actualIndex = hexaGrid.WordPositionToHexIndexes(worldPosition);
        //Then
        Assert.AreEqual(expectedHexIndex, actualIndex);
    }

    // A UnityTest behaves like a coroutine in Play Mode. In Edit Mode you can use
    // `yield return null;` to skip a frame.
    [UnityTest]
    public IEnumerator HexaGridTestWithEnumeratorPasses()
    {
        // Use the Assert class to test conditions.
        // Use yield to skip a frame.
        yield return null;
    }

    HexaGrid CreateHexGridInstance()
    {
        GameObject gm = new GameObject();
        HexaGrid hexaGrid = gm.AddComponent<HexaGrid>();
        hexaGrid.SetHextilePrefab(HexTilePrefab);
        hexaGrid.SetInstancesParent(gm.transform);
        return hexaGrid;
    }
}
