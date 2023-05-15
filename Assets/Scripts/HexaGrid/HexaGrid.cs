using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using Random = UnityEngine.Random;

public class HexaGrid : MonoBehaviour
{
    /// <summary>
    /// The percentage of grid to spawn object (do not spawn in border, they will be innaccesible)
    /// </summary>
    public const float MAP_SAFE_GRID_PERCENTAGE = 0.8f;
    public const int MAP_SAFE_GRID_OFFSET_X = (int)(MAP_WIDTH * (1-MAP_SAFE_GRID_PERCENTAGE));
    public const int MAP_SAFE_GRID_OFFSET_Y = (int)(MAP_HEIGHT * (1-MAP_SAFE_GRID_PERCENTAGE));
    /// <summary>
    /// The number of tiles on the X Axis
    /// </summary>
    public const int MAP_WIDTH = 100;
    /// <summary>
    /// The number of tiles on the Y Axis
    /// </summary>
    public const int MAP_HEIGHT = 100;
    /// <summary>
    /// The spacing between two tiles on X axis
    /// </summary>
    public const float SPACING_WIDTH = 2f;
    /// <summary>
    /// The spacing between two tiles on Y axis
    /// </summary>
    public const float SPACING_HEIGHT = 1.75f;


    [SerializeField]
    GameObject _hextilePrefab;
    [SerializeField]
    Transform _hexInstancesParent;
    [SerializeField]
    Material _defaultMaterial;

    //Used for unit tests only
    public void SetHextilePrefab(GameObject hextilePrefab)
    {
        _hextilePrefab = hextilePrefab;
    }
    public void SetInstancesParent(Transform instancesParent)
    {
        _hexInstancesParent = instancesParent;
    }

    /// <summary>
    /// Store all the hextile prefab instances renderer
    /// </summary>
    Renderer[][] _hexatilesInstances;

    /// <summary>
    /// Used to cache material for GPU Instancing 
    /// </summary>
    Dictionary<Color, Material> _cachedMaterials = new Dictionary<Color, Material>();

    /// <summary>
    /// All the hexagones owned by bases
    /// </summary>
    Dictionary<Base, List<Vector2Int>> _hexagonsProperties = new Dictionary<Base, List<Vector2Int>>();

    /// <summary>
    /// Generate a new grid of hextiles. 
    /// Instantiate and place every hextiles.
    /// This method was based on this video : https://www.youtube.com/watch?v=EPaSmQ2vtek (Only the 'Creating Layout' section)
    /// </summary>
    /// <remarks>This method is very CPU (GetComponent) and RAM (Instanciation) intensive. Use it carefully (can take 1 full second to execute).</remarks>
    public void Generate()
    {
        _hexatilesInstances = new Renderer[MAP_WIDTH][];
        Quaternion quaternionRotation = Quaternion.Euler(-90, 0, 0);

        //The absoluteWidthHalf and absoluteheightHalf are used to shift negatively the spawn location of the instances so that the 0,0 (world position) is in the middle of the hex grid and not at the end
        float absoluteWidthHalf = MAP_WIDTH * SPACING_WIDTH / 2;
        float absoluteheightHalf = MAP_HEIGHT * SPACING_HEIGHT / 2;
        for (int x = 0; x < MAP_WIDTH; x++)
        {
            _hexatilesInstances[x] = new Renderer[MAP_HEIGHT];
            for (int y = 0; y < MAP_HEIGHT; y++)
            {
                GameObject hexTile;

                //The generation is the same as for generating squares except that one line out of two is shifted on the X axis (left if odd)
                if (y % 2 == 0)
                    hexTile = Instantiate(_hextilePrefab, new Vector3(x * SPACING_WIDTH - absoluteWidthHalf, y * SPACING_HEIGHT - absoluteheightHalf, 0), quaternionRotation);
                else
                    hexTile = Instantiate(_hextilePrefab, new Vector3((x * SPACING_WIDTH) - (SPACING_WIDTH / 2) - absoluteWidthHalf, y * SPACING_HEIGHT - absoluteheightHalf, 0), quaternionRotation);
                hexTile.transform.SetParent(_hexInstancesParent);
                _hexatilesInstances[x][y] = hexTile.GetComponent<Renderer>();
            }
        }
    }

    /// <summary>
    /// Set all the hextiles to the default state (reset all parameters without regenerating)
    /// </summary>
    public void Clear()
    {
        foreach (KeyValuePair<Base,List<Vector2Int>> baseHexPositions in _hexagonsProperties)
        {
            foreach (Vector2Int index in baseHexPositions.Value)
            {
                _hexatilesInstances[index.x][index.y].material = _defaultMaterial;
            }
            baseHexPositions.Value.Clear();
        }
        _hexagonsProperties.Clear();
        _cachedMaterials.Clear();
    }

    /// <summary>
    /// Set hexagon of a given index to a new property.
    /// This method should never be called from a client script (because the changes will only be local). 
    /// Only information received from the server should be passed to this method to replicate the state. 
    /// </summary>
    /// <param name="position">The index of the hexagon</param>
    /// <param name="property">The new owner or null for remove owner</param>
    public void SetHexagonProperty(Vector2Int position, Base property)
    {
        Base lastOwner = GetPropertyOfHexIndex(position);
        if (lastOwner != null)
        {
            _hexagonsProperties[lastOwner].Remove(position);
            _hexatilesInstances[position.x][position.y].material = _defaultMaterial;
        }
        if (property == null) return;
        if (!_hexagonsProperties.ContainsKey(property))
        {
            _hexagonsProperties[property] = new List<Vector2Int>();
        }
        _hexagonsProperties[property].Add(position);
        ChangeHexColor(position, property.Color);
    }

    /// <summary>
    /// Get a copy of the list of hexagons owned by the base at the current status
    /// </summary>
    /// <param name="givenBase">The owner of hexagons</param>
    /// <returns>The list or null</returns>
    public List<Vector2Int> GetHexagonsOfBase(Base givenBase)
    {
        return new List<Vector2Int>(_hexagonsProperties[givenBase]);
    }

    /// <summary>
    /// Try to get the base for the given hexagon index
    /// </summary>
    /// <param name="index">The index of hexagon</param>
    /// <returns>The base if owned or null</returns>
    public Base GetPropertyOfHexIndex(Vector2Int index)
    {
        foreach (KeyValuePair<Base, List<Vector2Int>> basePositions in _hexagonsProperties)
        {
            foreach (Vector2Int position in basePositions.Value)
            {
                if (position == index) return basePositions.Key;
            }
        }
        return null;
    }

    /// <summary>
    /// Change a hex color (based on the hex position)
    /// </summary>
    /// <param name="hexIndex">The hextile index</param>
    /// <param name="color">Color to change</param>
    void ChangeHexColor(Vector2Int hexIndex, Color color)
    {
        if (!(hexIndex.x >= 0 && hexIndex.x < MAP_WIDTH && hexIndex.y >= 0 && hexIndex.y < MAP_HEIGHT)) return;

        //Using the same material for the same color
        Material cachedMaterial;
        if (_cachedMaterials.TryGetValue(color, out cachedMaterial) == false)
        {
            //Creating a new instance of the material when changing his color
            _hexatilesInstances[hexIndex.x][hexIndex.y].material.color = color;
            _cachedMaterials.Add(color, _hexatilesInstances[hexIndex.x][hexIndex.y].material);
        }
        else
        {
            _hexatilesInstances[hexIndex.x][hexIndex.y].material = cachedMaterial;
        }
    }
}