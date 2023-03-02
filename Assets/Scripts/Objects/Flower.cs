using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Flower : PlacableObject
{
    const float MAX_SPAWN_TIME = 15;
    const float MIN_SPAWN_TIME = 5;

    [SerializeField]
    GameObject _pollenPrefab;
    [SerializeField]
    Transform[] _spawnPositions;

    List<Pollen> _pollenInstanced = new List<Pollen>();
    float _clock = 0;

    /// <inheritdoc/>
    public override void OnDestroyNeeded()
    {
        foreach (var instance in _pollenInstanced)
        {
            if(instance != null)
                Destroy(instance);
        }
        base.OnDestroyNeeded();
    }

    void Update()
    {
        _clock = _clock - Time.deltaTime;
        if(_clock < 0)
        {
            _clock = Random.Range(MIN_SPAWN_TIME, MAX_SPAWN_TIME);
            TryToSpawnPollen();
        }
    }

    void TryToSpawnPollen()
    {
        Transform spawnPoint = GetFreeSpawnPoint();
        if (spawnPoint == null) return;
        GameObject instance = Instantiate(_pollenPrefab, spawnPoint.position, spawnPoint.rotation, spawnPoint);
        _pollenInstanced.Add(instance.GetComponent<Pollen>());
        _pollenInstanced.RemoveAll(item => item == null);
    }

    Transform GetFreeSpawnPoint()
    {
        foreach (Transform spawn in _spawnPositions)
        {
            if (spawn.childCount == 0) return spawn;
        }
        return null;
    }
}
