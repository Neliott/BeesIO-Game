/**
 * All the possible events that can be sent from the server to the client
 */
enum ServerEventType{
    JOINED,
    GAME_OVER,
    LEFT,
    SPAWN,
    SPAWN_UNMANAGED,
    DESTROY,
    PICKUP,
    DROP,
    HEXAGON_PROPERTY_CHANGED,
    INITIAL_GAME_STATE,
    GAME_STATE_STREAM,
}

export default ServerEventType;