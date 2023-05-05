namespace Network
{
    /// <summary>
    /// All the possible events that can be sent from the client to the server
    /// </summary>
    public enum ClientEventType
    {
        JOIN,
        REJOIN,
        INPUT_STREAM,
        PICKUP,
        DROP,
    }
}