namespace Network
{
    /// <summary>
    /// Used to inform the client that a new object has been spawned.
    /// </summary>
    public class NetworkObjectSpawnAttributes
    {
        /// <summary>
        /// The id of the object that is being spawned.
        /// </summary>
        public int objectType;
        /// <summary>
        /// The type of the object that is being spawned.
        /// </summary>
        public NetworkObjectType type;
        /// <summary>
        /// The position of the object that is being spawned.
        /// </summary>
        public Position position;
        /// <summary>
        /// The direction of the object that is being spawned.
        /// </summary>
        public float direction;
    }
}