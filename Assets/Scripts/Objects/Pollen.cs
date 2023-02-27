using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pollen : PickupObject
{
    /// <summary>
    /// Drop the pollen (if on base, add it)
    /// </summary>
    public override void Drop()
    {
        base.Drop();
        //TODO : Add to base
    }
}