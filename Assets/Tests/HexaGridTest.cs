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
        Vector2Int expectedHexIndex = new Vector2Int(Random.Range(0, 200), Random.Range(0, 200));
        //When
        Vector2 worldPosition = HexaGrid.HexIndexesToWorldPosition(expectedHexIndex);
        Vector2Int actualIndex = HexaGrid.WordPositionToHexIndexes(worldPosition);
        //Then
        Assert.AreEqual(expectedHexIndex, actualIndex);
    }

    [Test]
    public void HexaGrid_WordPositionToHexIndexes_Center_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(0f, 0f);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2Int actualIndexes = HexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedX_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH, 0f);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2)+1, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2Int actualIndexes = HexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedY_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(0f, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2Int actualIndexes = HexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedXY_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2) + 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2Int actualIndexes = HexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }
    [Test]
    public void HexaGrid_WordPositionToHexIndexes_ShiftedXYRound_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH / 2.5f, HexaGrid.SPACING_HEIGHT / 2.5f);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2Int actualIndexes = HexaGrid.WordPositionToHexIndexes(expectedWorldPosition);
        //Then
        Assert.AreEqual(expectedIndexes, actualIndexes);
    }

    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_Center_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(0f, 0f);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2 actualWorldPosition = HexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }
    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_ShiftedX_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH, 0f);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2) + 1, HexaGrid.MAP_HEIGHT / 2);
        //When
        Vector2 actualWorldPosition = HexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }
    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_ShiftedY_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(-HexaGrid.SPACING_WIDTH/2, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int(HexaGrid.MAP_WIDTH / 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2 actualWorldPosition = HexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }
    [Test]
    public void HexaGrid_HexIndexesToWorldPosition_ShiftedXY_Equals()
    {
        //Given
        Vector2 expectedWorldPosition = new Vector2(HexaGrid.SPACING_WIDTH * 1.5f, HexaGrid.SPACING_HEIGHT);
        Vector2Int expectedIndexes = new Vector2Int((HexaGrid.MAP_WIDTH / 2) + 2, (HexaGrid.MAP_HEIGHT / 2) + 1);
        //When
        Vector2 actualWorldPosition = HexaGrid.HexIndexesToWorldPosition(expectedIndexes);
        //Then
        Assert.AreEqual(expectedWorldPosition, actualWorldPosition);
    }

    [Test]
    public void HexaGrid_GetBigHexagonPositions_WithFill_Equals()
    {
        //Given
        Vector2Int center = new Vector2Int(0, 0);
        int radius = 4;
        bool outline = false;
        List<Vector2Int> expectedHexagonPositions = new List<Vector2Int>() {
            new Vector2Int(-1,-3),
            new Vector2Int(0,-3),
            new Vector2Int(1,-3),
            new Vector2Int(2,-3),
            new Vector2Int(-2,-2),
            new Vector2Int(-1,-2),
            new Vector2Int(0,-2),
            new Vector2Int(1,-2),
            new Vector2Int(2,-2),
            new Vector2Int(-2,-1),
            new Vector2Int(-1,-1),
            new Vector2Int(0,-1),
            new Vector2Int(1,-1),
            new Vector2Int(2,-1),
            new Vector2Int(3,-1),
            new Vector2Int(-3,0),
            new Vector2Int(-2,0),
            new Vector2Int(-1,0),
            new Vector2Int(0,0),
            new Vector2Int(1,0),
            new Vector2Int(2,0),
            new Vector2Int(3,0),
            new Vector2Int(-2,1),
            new Vector2Int(-1,1),
            new Vector2Int(0,1),
            new Vector2Int(1,1),
            new Vector2Int(2,1),
            new Vector2Int(3,1),
            new Vector2Int(-2,2),
            new Vector2Int(-1,2),
            new Vector2Int(0,2),
            new Vector2Int(1,2),
            new Vector2Int(2,2),
            new Vector2Int(-1,3),
            new Vector2Int(0,3),
            new Vector2Int(1,3),
            new Vector2Int(2,3),
        };
        //When
        //List<Vector2Int> actualHexagonPositions = HexaGrid.GetBigHexagonPositions(center, radius, outline);
        //Then
        //Assert.AreEqual(expectedHexagonPositions, actualHexagonPositions);
    }
    [Test]
    public void HexaGrid_GetBigHexagonPositions_OnlyOutline_Equals()
    {
        //Given
        Vector2Int center = new Vector2Int(0, 0);
        int radius = 4;
        bool outline = true;
        List<Vector2Int> expectedHexagonPositions = new List<Vector2Int>() {
            new Vector2Int(-1,-3),
            new Vector2Int(0,-3),
            new Vector2Int(1,-3),
            new Vector2Int(2,-3),
            new Vector2Int(-2,-2),
            new Vector2Int(2,-2),
            new Vector2Int(-2,-1),
            new Vector2Int(3,-1),
            new Vector2Int(-3,0),
            new Vector2Int(3,0),
            new Vector2Int(-2,1),
            new Vector2Int(3,1),
            new Vector2Int(-2,2),
            new Vector2Int(2,2),
            new Vector2Int(-1,3),
            new Vector2Int(0,3),
            new Vector2Int(1,3),
            new Vector2Int(2,3),
        };
        //When
        //List<Vector2Int> actualHexagonPositions = HexaGrid.GetBigHexagonPositions(center, radius, outline);
        //Then
        //Assert.AreEqual(expectedHexagonPositions, actualHexagonPositions);
    }
    [Test]
    public void HexaGrid_GetBigHexagonPositions_Bigger_WithFill_ShiftedY_Equals()
    {
        //Given
        Vector2Int center = new Vector2Int(0, 1);
        int radius = 7;
        bool outline = false;
        List<Vector2Int> expectedHexagonPositions = new List<Vector2Int>() {
            new Vector2Int(-3,-5),
            new Vector2Int(-2,-5),
            new Vector2Int(-1,-5),
            new Vector2Int(0,-5),
            new Vector2Int(1,-5),
            new Vector2Int(2,-5),
            new Vector2Int(3,-5),
            new Vector2Int(-4,-4),
            new Vector2Int(-3,-4),
            new Vector2Int(-2,-4),
            new Vector2Int(-1,-4),
            new Vector2Int(0,-4),
            new Vector2Int(1,-4),
            new Vector2Int(2,-4),
            new Vector2Int(3,-4),
            new Vector2Int(-4,-3),
            new Vector2Int(-3,-3),
            new Vector2Int(-2,-3),
            new Vector2Int(-1,-3),
            new Vector2Int(0,-3),
            new Vector2Int(1,-3),
            new Vector2Int(2,-3),
            new Vector2Int(3,-3),
            new Vector2Int(4,-3),
            new Vector2Int(-5,-2),
            new Vector2Int(-4,-2),
            new Vector2Int(-3,-2),
            new Vector2Int(-2,-2),
            new Vector2Int(-1,-2),
            new Vector2Int(0,-2),
            new Vector2Int(1,-2),
            new Vector2Int(2,-2),
            new Vector2Int(3,-2),
            new Vector2Int(4,-2),
            new Vector2Int(-5,-1),
            new Vector2Int(-4,-1),
            new Vector2Int(-3,-1),
            new Vector2Int(-2,-1),
            new Vector2Int(-1,-1),
            new Vector2Int(0,-1),
            new Vector2Int(1,-1),
            new Vector2Int(2,-1),
            new Vector2Int(3,-1),
            new Vector2Int(4,-1),
            new Vector2Int(5,-1),
            new Vector2Int(-6,0),
            new Vector2Int(-5,0),
            new Vector2Int(-4,0),
            new Vector2Int(-3,0),
            new Vector2Int(-2,0),
            new Vector2Int(-1,0),
            new Vector2Int(0,0),
            new Vector2Int(1,0),
            new Vector2Int(2,0),
            new Vector2Int(3,0),
            new Vector2Int(4,0),
            new Vector2Int(5,0),
            new Vector2Int(-6,1),
            new Vector2Int(-5,1),
            new Vector2Int(-4,1),
            new Vector2Int(-3,1),
            new Vector2Int(-2,1),
            new Vector2Int(-1,1),
            new Vector2Int(0,1),
            new Vector2Int(1,1),
            new Vector2Int(2,1),
            new Vector2Int(3,1),
            new Vector2Int(4,1),
            new Vector2Int(5,1),
            new Vector2Int(6,1),
            new Vector2Int(-6,2),
            new Vector2Int(-5,2),
            new Vector2Int(-4,2),
            new Vector2Int(-3,2),
            new Vector2Int(-2,2),
            new Vector2Int(-1,2),
            new Vector2Int(0,2),
            new Vector2Int(1,2),
            new Vector2Int(2,2),
            new Vector2Int(3,2),
            new Vector2Int(4,2),
            new Vector2Int(5,2),
            new Vector2Int(-5,3),
            new Vector2Int(-4,3),
            new Vector2Int(-3,3),
            new Vector2Int(-2,3),
            new Vector2Int(-1,3),
            new Vector2Int(0,3),
            new Vector2Int(1,3),
            new Vector2Int(2,3),
            new Vector2Int(3,3),
            new Vector2Int(4,3),
            new Vector2Int(5,3),
            new Vector2Int(-5,4),
            new Vector2Int(-4,4),
            new Vector2Int(-3,4),
            new Vector2Int(-2,4),
            new Vector2Int(-1,4),
            new Vector2Int(0,4),
            new Vector2Int(1,4),
            new Vector2Int(2,4),
            new Vector2Int(3,4),
            new Vector2Int(4,4),
            new Vector2Int(-4,5),
            new Vector2Int(-3,5),
            new Vector2Int(-2,5),
            new Vector2Int(-1,5),
            new Vector2Int(0,5),
            new Vector2Int(1,5),
            new Vector2Int(2,5),
            new Vector2Int(3,5),
            new Vector2Int(4,5),
            new Vector2Int(-4,6),
            new Vector2Int(-3,6),
            new Vector2Int(-2,6),
            new Vector2Int(-1,6),
            new Vector2Int(0,6),
            new Vector2Int(1,6),
            new Vector2Int(2,6),
            new Vector2Int(3,6),
            new Vector2Int(-3,7),
            new Vector2Int(-2,7),
            new Vector2Int(-1,7),
            new Vector2Int(0,7),
            new Vector2Int(1,7),
            new Vector2Int(2,7),
            new Vector2Int(3,7),
        };
        //When
        //List<Vector2Int> actualHexagonPositions = HexaGrid.GetBigHexagonPositions(center, radius, outline);
        //Then
        //Assert.AreEqual(expectedHexagonPositions, actualHexagonPositions);
    }
    [Test]
    public void HexaGrid_GetBigHexagonPositions_Bigger_OnlyOutline_ShiftedY_Equals()
    {
        //Given
        Vector2Int center = new Vector2Int(0, 1);
        int radius = 7;
        bool outline = true;
        List<Vector2Int> expectedHexagonPositions = new List<Vector2Int>() {
            new Vector2Int(-3,-5),
            new Vector2Int(-2,-5),
            new Vector2Int(-1,-5),
            new Vector2Int(0,-5),
            new Vector2Int(1,-5),
            new Vector2Int(2,-5),
            new Vector2Int(3,-5),
            new Vector2Int(-4,-4),
            new Vector2Int(3,-4),
            new Vector2Int(-4,-3),
            new Vector2Int(4,-3),
            new Vector2Int(-5,-2),
            new Vector2Int(4,-2),
            new Vector2Int(-5,-1),
            new Vector2Int(5,-1),
            new Vector2Int(-6,0),
            new Vector2Int(5,0),
            new Vector2Int(-6,1),
            new Vector2Int(6,1),
            new Vector2Int(-6,2),
            new Vector2Int(5,2),
            new Vector2Int(-5,3),
            new Vector2Int(5,3),
            new Vector2Int(-5,4),
            new Vector2Int(4,4),
            new Vector2Int(-4,5),
            new Vector2Int(4,5),
            new Vector2Int(-4,6),
            new Vector2Int(3,6),
            new Vector2Int(-3,7),
            new Vector2Int(-2,7),
            new Vector2Int(-1,7),
            new Vector2Int(0,7),
            new Vector2Int(1,7),
            new Vector2Int(2,7),
            new Vector2Int(3,7),
        };
        //When
        //List<Vector2Int> actualHexagonPositions = HexaGrid.GetBigHexagonPositions(center, radius, outline);
        //Then
       // Assert.AreEqual(expectedHexagonPositions, actualHexagonPositions);
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
