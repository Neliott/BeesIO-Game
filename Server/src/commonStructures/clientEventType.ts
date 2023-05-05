/**
 * All the possible events that can be sent from the client to the server
 */
enum ClientEventType{
    JOIN,
    REJOIN,
    INPUT_STREAM,
    PICKUP,
    DROP,
}

export default ClientEventType;