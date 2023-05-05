namespace Network
{
    /// <summary>
    /// This class is used to store the initial state of the game to be sent to a client.
    /// </summary>
    public class InitialGameState
    {
        /// <summary>
        /// The id of the client that owns this state.
        /// </summary>
        public int ownedClientID;
        /// <summary>
        /// The index of the simulation state that the client should start at.
        /// </summary>
        public int simulationStateStartIndex;
        /// <summary>
        /// The initial attributes of the other clients.
        /// </summary>
        public NetworkPlayerFixedAttributes[] otherClientsInitialAttributes;
        /// <summary>
        /// The list of objects in the game.
        /// </summary>
        public NetworkOwnedObjectsList[] objects;
        /// <summary>
        /// The list of objects owned by the client.
        /// </summary>
        public NetworkOwnedObjectsList[] ownedObjects;
    }
}