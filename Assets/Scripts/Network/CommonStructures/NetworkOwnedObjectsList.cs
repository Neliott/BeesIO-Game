using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Network
{
    /// <summary>
    /// This class is used to store the list of objects owned by a player.
    /// </summary>
    public class NetworkOwnedObjectsList
    {
        /// <summary>
        /// The id of the player.
        /// </summary>
        public int playerId;
        /// <summary>
        /// The list of objects owned by the player.
        /// </summary>
        public int[] ownedObjects;
    }
}
