namespace Network
{
    /// <summary>
    /// The input state of a player to be sent over the network. Used to compute the simulation state.
    /// </summary>
    public class NetworkPlayerInputState
    {
        /// <summary>
        /// The simulation frame that this input state is for.
        /// </summary>
        public int simulationFrame;
        /// <summary>
        /// The direction that the player is facing.
        /// </summary>
        public float direction;
        /// <summary>
        /// The constructor for the NetworkPlayerInputState class.
        /// </summary>
        /// <param name="simulationFrame">The simulation frame that this input state is for.</param>
        /// <param name="direction">The direction that the player is facing.</param>
        public NetworkPlayerInputState(int simulationFrame, float direction)
        {
            this.simulationFrame = simulationFrame;
            this.direction = direction;
        }
    }
}