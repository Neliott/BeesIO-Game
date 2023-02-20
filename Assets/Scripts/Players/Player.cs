using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class Player : MonoBehaviour
{
    /// <summary>
    /// Is the player controlled locally ?
    /// </summary>
    public abstract bool IsControlled { get; }
}
