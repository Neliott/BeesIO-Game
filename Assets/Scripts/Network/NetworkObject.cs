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

        private NetworkPlayer _owner;

        /// <summary>
        /// Get the current owner of this object
        /// </summary>
        public NetworkPlayer Owner
        {
            get { return _owner; }
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
        public virtual void OnPickup(NetworkPlayer owner)
        {
            _owner = owner;
        }

        /// <summary>
        /// Method called when the object is droped
        /// </summary>
        public virtual void OnDrop(Position newPosition)
        {
            _owner = null;
        }
    }
}