using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObjectsManager : MonoBehaviour
{
    /// <summary>
    /// The target number of objects in the map
    /// </summary>
    public const int TARGET_OBJECTS_AMOUNT = 200;
    /// <summary>
    /// Spawn objects every 1/rate seconds if needed
    /// </summary>
    public const float SPAWN_OBJECTS_RATE = 1.5f;

    [SerializeField]
    GameObject _genericObjectToSpawn;
    [SerializeField]
    Transform _spawnedObjectsParent;

#if UNITY_EDITOR
    //Used for unit tests only
    public void SetGenericObjectToSpawn(GameObject genericObjectToSpawn)
    {
        _genericObjectToSpawn = genericObjectToSpawn;
    }
    public void SetSpawnedObjectsParent(Transform spawnedObjectsParent)
    {
        _spawnedObjectsParent = spawnedObjectsParent;
    }
#endif

    bool _canSpanwObjects;
    float _clock = 0;
    List<PlacableObject> _spawnedObjects = new List<PlacableObject>();

    /// <summary>
    /// Can the object manager spawn objects ?
    /// </summary>
    public bool CanSpanwObjects
    {
        get { return _canSpanwObjects; }
        set { 
            _canSpanwObjects = value;
            if (_canSpanwObjects) StartSpawningObject();
            else StopSpawningObjects();
        }
    }

    void Update()
    {
        if (!_canSpanwObjects) return;
        _spawnedObjects.RemoveAll(item => item == null);
        if (_spawnedObjects.Count >= TARGET_OBJECTS_AMOUNT) return;

        _clock = _clock + Time.deltaTime;
        if(_clock > 1 / SPAWN_OBJECTS_RATE)
        {
            _clock = 0;
            SpawnPickupObject();
        }
    }
    void StartSpawningObject()
    {
        _clock = 0;
        for (int i = 0; i < TARGET_OBJECTS_AMOUNT; i++)
        {
            SpawnPickupObject();
        }
    }

    void StopSpawningObjects()
    {
        foreach (PlacableObject spawnedObject in _spawnedObjects)
        {
            spawnedObject.OnDestroyNeeded();
        }
        _spawnedObjects.Clear();
    }

    void SpawnPickupObject()
    {
        GameObject instance = Instantiate(_genericObjectToSpawn, GetRandomPlaceOnMap(), Quaternion.identity, _spawnedObjectsParent);
        PlacableObject placableObject = instance.GetComponent<PlacableObject>();
        placableObject.OnPlaced();
        _spawnedObjects.Add(placableObject);
    }

    Vector2 GetRandomPlaceOnMap()
    {
        if (GameManager.Instance == null)
            return new Vector2(Random.Range(0, HexaGrid.MAP_WIDTH), Random.Range(0, HexaGrid.MAP_HEIGHT));
        return GameManager.Instance.HexaGrid.HexIndexesToWorldPosition(new Vector2Int(Random.Range(0, HexaGrid.MAP_WIDTH), Random.Range(0, HexaGrid.MAP_HEIGHT)));
    }
}
