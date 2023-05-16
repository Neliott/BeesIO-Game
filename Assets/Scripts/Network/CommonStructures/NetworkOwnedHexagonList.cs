namespace Network
{
    /// <summary>
    /// A class that contains the information about hexagons owned by a player
    /// </summary>
    public class NetworkOwnedHexagonList
    {
        /// <summary>
        /// The id of the player 
        /// </summary>
        public int id;
        /// <summary>
        /// The list of hexagons owned by the player
        /// </summary>
        public Position[] hexagonList;
        /// <summary>
        /// Create a new instance of NetworkOwnedHexagonList
        /// </summary>
        /// <param name="id">The id of the player</param>
        /// <param name="hexagonList">The list of hexagons owned by the player</param>
        public NetworkOwnedHexagonList(int id,Position[] hexagonList)
        {
            this.id = id;
            this.hexagonList = hexagonList;
        }
    }
}
