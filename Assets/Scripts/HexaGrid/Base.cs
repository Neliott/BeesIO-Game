using Network;
using UnityEngine;

/// <summary>
/// The client base (only the text mesh name / the display)
/// </summary>
public class Base : MonoBehaviour
{
    /// <summary>
    /// Get the color of the base
    /// </summary>
    public Color Color
    {
        get { return _color; }
    }

    [SerializeField]
    TextMesh _playerName;
    Color _color;


    /// <summary>
    /// Setup the base
    /// </summary>
    /// <param name="fixedAttributes">Spawn attributes from the player</param>
    public void Setup(NetworkPlayerFixedAttributes fixedAttributes)
    {
        _playerName.text = fixedAttributes.name;
        _color = Color.HSVToRGB(fixedAttributes.colorHue / 360f, 1, 1f);
    }
}
