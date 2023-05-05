namespace Network
{
    /// <summary>
    /// The fixed attributes of a player.
    /// </summary>
    public class NetworkPlayerFixedAttributes
    {
        /// <summary>
        /// The id of the player.
        /// </summary>
        public int id;
        /// <summary>
        /// The color hue of the player.
        /// </summary>
        public int colorHue;
        /// <summary>
        /// The name of the player.
        /// </summary>
        public string name;
        /// <summary>
        /// The base position of the player.
        /// </summary>
        public Position basePosition;
        /// <summary>
        /// The constructor for the NetworkPlayerFixedAttributes class.
        /// </summary>
        /// <param name="id">The id of the player.</param>
        /// <param name="colorHue">The color hue of the player.</param>
        /// <param name="name">The name of the player.</param>
        /// <param name="basePosition">The base position of the player.</param>
        public NetworkPlayerFixedAttributes(int id, int colorHue, string name, Position basePosition)
        {
            this.id = id;
            this.colorHue = colorHue;
            this.name = name;
            this.basePosition = basePosition;
        }
    }
}