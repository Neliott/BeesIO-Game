namespace Network
{
    /// <summary>
    /// The game state of a given player.
    /// </summary>
    public class NetworkPlayerGameStateStream
    {
        /// <summary>
        /// The id of the player.
        /// </summary>
        public int id;
        /// <summary>
        /// The simulation state of the player.
        /// </summary>
        public NetworkPlayerSimulationState simulationState;
    }
}
