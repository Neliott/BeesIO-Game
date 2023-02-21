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

    [Test]
    public void HexaGrid_WordPositionToHexIndexes_Center_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(0f, 0f);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2Int actualIndexes = hexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedX_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH, 0f);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2)+1, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2Int actualIndexes = hexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedY_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(0f, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2Int actualIndexes = hexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedXY_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2) + 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2Int actualIndexes = hexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedXYRound_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH / 2.5f, HexaGrid.SPACING_HEIGHT / 2.5f);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2Int actualIndexes = hexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }

    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_Center_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(0f, 0f);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2 actualWorldPosition = hexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }
    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_ShiftedX_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH, 0f);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2) + 1, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2 actualWorldPosition = hexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }
    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_ShiftedY_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(-HexaGrid.SPACING_WIDTH/2, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2 actualWorldPosition = hexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }
    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_ShiftedXY_Equals()
    {
        //Given
        HexaGrid hexaGrid = CreateHexGridInstance();
        hexaGrid.Generate();
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH*1.5f, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2) + 2, (HexaGrid.MAP_HEIGHT / 2)+1);
        //When
        Vector2 actualWorldPosition = hexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
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
