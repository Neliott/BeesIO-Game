using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pollen : Network.NetworkObject
{
    /// <summary>
    /// Drop the pollen (if on base, add it)
    /// </summary>
    /*public override void Drop()
    {
        if (_owner == null) return;//Todo : Fix owner null
        Vector2Int indexes = HexaGrid.WordPositionToHexIndexes(_owner.transform.position);
        Base baseOn = GameManager.Instance.HexaGrid.GetPropertyOfHexIndex(indexes);
        if(baseOn != null)
        {
            baseOn.Upgrade(1);
            OnDestroyNeeded();
        }
        base.Drop();
    }*/
}