using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Mover))]
public abstract class Player : MonoBehaviour
{
    /// <summary>
    /// Is the player controlled locally ?
    /// </summary>
    public abstract bool IsControlled { get; }

    protected Mover _mover;

    /// <summary>
    /// Setup the player when instanciated
    /// </summary>
    public virtual void Setup()
    {
        _mover = GetComponent<Mover>();
        _mover.Speed = 10;
    }
}
