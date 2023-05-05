using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Network
{
    /// <summary>
    /// Used to send the informations about the objects dropped by a player.
    /// </summary>
    public class NetworkDropAttributes
    {
        /// <summary>
        /// The id of the player.
        /// </summary>
        public int playerId;
        /// <summary>
        /// The list of objects dropped by the player.
        /// </summary>
        public NetworkObjectDropAttributes[] objectsDropped;
    }
}
