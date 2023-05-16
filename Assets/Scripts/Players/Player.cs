using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Mover))]
[RequireComponent(typeof(PickupController))]
public abstract class Player : MonoBehaviour
{
    /// <summary>
    /// Is the player controlled locally ?
    /// </summary>
    public abstract bool IsControlled { get; }

    /// <summary>
    /// Get the base of this player
    /// </summary>
    public Base Base { get => _base; }

    /// <summary>
    /// Get the name of this player
    /// </summary>
    public string Name { get => _name; }

    /// <summary>
    /// Get the pickup controller
    /// </summary>
    public PickupController PickupController { get => _pickupController; }

    [SerializeField] GameObject _basePrefab;
    [SerializeField] SpriteRenderer _coloredRenderer;

    protected Mover _mover;
    protected string _name;
    protected Base _base;
    protected PickupController _pickupController;

    /// <summary>
    /// Setup the player when instanciated
    /// </summary>
    public virtual void Setup(string name)
    {
        /*_pickupController = GetComponent<PickupController>();

        _mover = GetComponent<Mover>();
        _mover.Speed = 6.5f;
        _name = name;
        gameObject.name = name;

        GameObject baseGo = Instantiate(_basePrefab, transform.position, Quaternion.identity);
        _base = baseGo.GetComponent<Base>();
        _base.Setup(name);
        _base.OnBaseDestroyed += OnBaseDestroyed;
        _coloredRenderer.color = _base.Color;*/
    }

    protected virtual void OnBaseDestroyed()
    {
        //GameManager.Instance.OnPlayerDestroyed(this);
        _pickupController.Drop();
        Destroy(gameObject);
    }

    private void OnDestroy()
    {
        //_base.OnBaseDestroyed -= OnBaseDestroyed;
    }
}
