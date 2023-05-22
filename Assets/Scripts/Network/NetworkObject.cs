using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace Network
{
    public class NetworkObject : MonoBehaviour
    {
        private NetworkObjectSpawnAttributes _spawnAttributes;

        /// <summary>
        /// Get the initial spawn attributes
        /// </summary>
        public NetworkObjectSpawnAttributes SpawnAttributes
        {
            get { return _spawnAttributes; }
        }

        /// <summary>
        /// Setup the new network object with initial spawn attributes
        /// </summary>
        /// <param name="spawnAttributes">The attributes</param>
        public void Setup(NetworkObjectSpawnAttributes spawnAttributes)
        {
            _spawnAttributes = spawnAttributes;
        }

        /// <summary>
        /// Method called when the object is picked up
        /// </summary>
        public virtual void OnPickup()
        {

        }

        /// <summary>
        /// Method called when the object is droped
        /// </summary>
        public virtual void OnDrop(Position newPosition)
        {

        }
    }
}