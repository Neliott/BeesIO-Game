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

    [SerializeField] GameObject _basePrefab;
    [SerializeField] SpriteRenderer _coloredRenderer;

    protected Mover _mover;
    protected string _name;
    protected Base _base;

    /// <summary>
    /// Setup the player when instanciated
    /// </summary>
    public virtual void Setup(string name)
    {
        _mover = GetComponent<Mover>();
        _mover.Speed = 6.5f;
        _name = name;
        GameObject baseGo = Instantiate(_basePrefab, transform.position, Quaternion.identity);
        _base = baseGo.GetComponent<Base>();
        _base.Setup(name);
        _base.OnBaseDestroyed += OnBaseDestroyed;
        _coloredRenderer.color = _base.Color;
    }

    protected virtual void OnBaseDestroyed()
    {
        Destroy(gameObject);
    }

    private void OnDestroy()
    {
        _base.OnBaseDestroyed -= OnBaseDestroyed;
    }
}
