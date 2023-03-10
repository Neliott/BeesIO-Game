using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class ObjectsManager : MonoBehaviour
{
    /// <summary>
    /// The target number of objects in the map
    /// </summary>
    public const int TARGET_OBJECTS_AMOUNT = 75;
    /// <summary>
    /// The number of flowers to spawn
    /// </summary>
    public const int FLOWERS_AMOUNT = 15;
    /// <summary>
    /// Spawn objects every 1/rate seconds if needed
    /// </summary>
    public const float SPAWN_OBJECTS_RATE = 1.5f;

    [SerializeField]
    List<GameObject> _objectsToSpawn = new List<GameObject>();
    [SerializeField]
    GameObject _flower;
    [SerializeField]
    Transform _spawnedObjectsParent;

#if UNITY_EDITOR
    //Used for unit tests only
    public void SetObjectsToSpawn(List<GameObject> objectsToSpawn)
    {
        _objectsToSpawn = objectsToSpawn;
    }
    public void SetFlower(GameObject flower)
    {
        _flower = flower;
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
    /// The list of all spawned objects
    /// </summary>
    public List<PlacableObject> SpawnedObjects { get { return _spawnedObjects; } }

    /// <summary>
    /// The list of all spawned objects of a given type
    /// </summary>
    /// <typeparam name="T">The type of object to get</typeparam>
    /// <returns>The list of all placable objects of the given type</returns>
    public List<PlacableObject> GetSpawnedObjectsByType<T>() where T : PlacableObject
    {
        return _spawnedObjects.Where(objectToTest => objectToTest is T).ToList();
    }

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
        if ((_spawnedObjects.Count - FLOWERS_AMOUNT) >= TARGET_OBJECTS_AMOUNT) return;

        _clock = _clock + Time.deltaTime;
        if(_clock > 1 / SPAWN_OBJECTS_RATE)
        {
            _clock = 0;
            SpawnRandomObject();
        }
    }

    void StartSpawningObject()
    {
        _clock = 0;
        for (int i = 0; i < TARGET_OBJECTS_AMOUNT; i++)
        {
            SpawnRandomObject();
        }
        for (int i = 0; i < FLOWERS_AMOUNT; i++)
        {
            SpawnObject(_flower);
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

    void SpawnRandomObject()
    {
        SpawnObject(_objectsToSpawn[Random.Range(0, _objectsToSpawn.Count)]);
    }

    void SpawnObject(GameObject prefab)
    {
        GameObject instance = Instantiate(prefab, HexaGrid.GetRandomPlaceOnMap(), Quaternion.identity, _spawnedObjectsParent);
        PlacableObject placableObject = instance.GetComponent<PlacableObject>();
        placableObject.OnPlaced();
        _spawnedObjects.Add(placableObject);
    }
}
