using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObjectsManager : MonoBehaviour
{
    const float SPAWN_OBJECTS_RATE = 1.5f;
    const int TARGET_OBJECTS_AMOUNT = 200;

    [SerializeField]
    GameObject _genericObjectToSpawn;
    [SerializeField]
    Transform _spawnedObjectsParent;

    bool _canSpanwObjects;
    float _clock = 0;
    List<IPlacableObject> _spawnedObjects = new List<IPlacableObject>();

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
        if (!_canSpanwObjects || _spawnedObjects.Count > TARGET_OBJECTS_AMOUNT) return;

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
        foreach (IPlacableObject spawnedObject in _spawnedObjects)
        {
            spawnedObject.OnDestroyNeeded();
        }
        _spawnedObjects.Clear();
    }

    void SpawnPickupObject()
    {
        GameObject instance = Instantiate(_genericObjectToSpawn, GetRandomPlaceOnMap(), Quaternion.identity, _spawnedObjectsParent);
        IPlacableObject placableObject = instance.GetComponent<IPlacableObject>();
        placableObject.OnPlaced();
        _spawnedObjects.Add(placableObject);
    }

    Vector2 GetRandomPlaceOnMap()
    {
        return GameManager.Instance.HexaGrid.HexIndexesToWorldPosition(new Vector2Int(Random.Range(0, HexaGrid.MAP_WIDTH), Random.Range(0, HexaGrid.MAP_HEIGHT)));
    }
}
