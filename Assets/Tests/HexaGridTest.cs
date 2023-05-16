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

    HexaGrid CreateHexGridInstance()
    {
        GameObject gm = new GameObject();
        HexaGrid hexaGrid = gm.AddComponent<HexaGrid>();
        hexaGrid.SetHextilePrefab(HexTilePrefab);
        hexaGrid.SetInstancesParent(gm.transform);
        return hexaGrid;
    }
}
