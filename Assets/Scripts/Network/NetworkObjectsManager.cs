using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace Network
{
    public class NetworkObjectsManager : MonoBehaviour
    {
        private Dictionary<int, NetworkObject> _spawnedObjects = new Dictionary<int, NetworkObject>();

        /// <summary>
        /// Get the list of objects currently on the map
        /// </summary>
        public Dictionary<int, NetworkObject> SpawnedObjects
        {
            get { return _spawnedObjects; }
        }

        [SerializeField] GameObject[] _objectsPrefabs;

        /// <summary>
        /// Spawn a new object with given attributes
        /// </summary>
        /// <param name="attribute">The attributes provided by the server</param>
        public void SpawnObject(NetworkObjectSpawnAttributes attribute)
        {
            GameObject newObject = Instantiate(_objectsPrefabs[(int)attribute.type], attribute.position.ToVector2(), Quaternion.Euler(new Vector3(0, 0, attribute.direction)));
            _spawnedObjects.Add(attribute.id, newObject.GetComponent<NetworkObject>());
        }

        /// <summary>
        /// Spawn a new temporary object (only instanciate, without adding it to the list). It also doesn't need a attached NetworkObject.
        /// </summary>
        /// <param name="attribute">The attributes provided by the server</param>
        public void SpawnParticule(NetworkObjectSpawnAttributes attribute)
        {
            Instantiate(_objectsPrefabs[(int)attribute.type], attribute.position.ToVector2(), Quaternion.Euler(new Vector3(0, 0, attribute.direction)));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        public void DestroyObject(int id)
        {

        }
    }
}