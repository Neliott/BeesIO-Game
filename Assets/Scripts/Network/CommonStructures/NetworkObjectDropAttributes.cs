using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Network
{
    /// <summary>
    /// The informations about a dropped object
    /// </summary>
    public class NetworkObjectDropAttributes
    {
        /// <summary>
        /// The new position of the object.
        /// </summary>
        public Position newPosition;
        /// <summary>
        /// The id of the object.
        /// </summary>
        public int objectID;
    }
}
