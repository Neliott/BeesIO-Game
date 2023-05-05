namespace Network
{
    /// <summary>
    /// The simulation state of a player. (Result of a input state)
    /// </summary>
    public class NetworkPlayerSimulationState
    {
        /// <summary>
        /// The simulation frame of the player.
        /// </summary>
        public int simulationFrame;
        /// <summary>
        /// The direction of the player.
        /// </summary>
        public float direction;
        /// <summary>
        /// The position of the player.
        /// </summary>
        public Position position;
    }
}