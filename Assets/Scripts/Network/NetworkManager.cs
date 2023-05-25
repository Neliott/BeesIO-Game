using Network.Transport;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace Network
{
    /// <summary>
    /// This manager is used to serialize and deserialize all the game informations with the server
    /// </summary>
    public class NetworkManager : MonoBehaviour
    {
        /// <summary>
        /// The connection timeout in milliseconds
        /// </summary>
        public const int CONNECTION_TIMEOUT = 2000;
        /// <summary>
        /// Number of network tick per seconds
        /// </summary>
        public const int CLIENT_TICK_PER_SECOND = 10;
        /// <summary>
        /// Interval between two local simulated network tick
        /// </summary>
        public const float CLIENT_TICK_INTERVAL = 1f / CLIENT_TICK_PER_SECOND;

        /// <summary>
        /// All the possible network state (low level)
        /// </summary>
        public enum NetworkState
        {
            NOT_CONNECTED,
            CONNECTING,
            CONNECTED,
            RECONNECTING,
            DISCONNECTING
        }

        private NetworkState _state;

        /// <summary>
        /// Get the current network state
        /// </summary>
        public NetworkState State
        {
            get { return _state; }
            private set
            {
                _state = value;
                OnStateChanged?.Invoke(value);
            }
        }

        /// <summary>
        /// Triggered when the current state has changed
        /// </summary>
        public event Action<NetworkState> OnStateChanged;

        [SerializeField] bool _forceProdServer;
        [SerializeField] string _devServerUrl;
        [SerializeField] string _prodServerUrl;
        ITransport _transport;
        DateTime _lastSeenServer;
        float _clock = 0;
        int? _lastPlayerIdOwned = null;

        #region MonoBehaviour Callbacks
        private void Awake()
        {
            State = NetworkState.NOT_CONNECTED;

            //Using different transport depending on the platform
#if UNITY_WEBGL && !UNITY_EDITOR
            _transport = new WebSocketJsTransport();
#else
            _transport = new WebSocketSharpTransport();
#endif
            _transport.OnMessage += _transport_OnMessage;
            _transport.OnError += _transport_OnError;
            _transport.OnClose += _transport_OnClose;
            _transport.OnOpen += _transport_OnOpen;
        }

        private void Update()
        {
            if (State != NetworkState.CONNECTED) return;

            if ((DateTime.Now - _lastSeenServer).TotalMilliseconds > CONNECTION_TIMEOUT) Reconnect();

            _clock += Time.deltaTime;
            while (_clock > CLIENT_TICK_INTERVAL)
            {
                _clock -= CLIENT_TICK_INTERVAL;
                NetworkTick();
            }
        }

        private void OnDestroy()
        {
            _transport.Disconnect();
        }
        #endregion
        #region Actions
        /// <summary>
        /// Connect to the server to join a game
        /// </summary>
        public void Connect()
        {
            Debug.LogWarning("Connecting");
#if UNITY_WEBGL && !UNITY_EDITOR
            _transport.Connect(_prodServerUrl);
#else
            _transport.Connect(_forceProdServer? _prodServerUrl:_devServerUrl);
#endif
            State = NetworkState.CONNECTING;
        }

        /// <summary>
        /// Send a pickup request to the server
        /// </summary>
        public void SendPickupRequest()
        {
            SendEvent(ClientEventType.PICKUP);
        }

        /// <summary>
        /// Send a drop request to the server
        /// </summary>
        public void SendDropRequest()
        {
            SendEvent(ClientEventType.DROP);
        }

        private void Reconnect()
        {
            State = NetworkState.RECONNECTING;
            Debug.LogWarning("Connection to server lost! Trying to reconnect.");
            if (!_transport.IsConnected)
            {
                _transport.Disconnect();
#if UNITY_WEBGL && !UNITY_EDITOR
                _transport.Connect(_prodServerUrl);
#else
                _transport.Connect(_devServerUrl);
#endif
            }
            else
            {
                Rejoin();
            }
        }

        private void Join(string name)
        {
            SendEvent(ClientEventType.JOIN, name);
        }

        private void Rejoin()
        {
            SendEvent(ClientEventType.REJOIN, _lastPlayerIdOwned);
            GameManager.Instance.Players.CurrentPlayerIdOwned = null;
        }

        private void NetworkTick()
        {
            foreach (var clientInstance in GameManager.Instance.Players.NetworkedClients)
            {
                clientInstance.Value.NetworkTick();
            }
            if (GameManager.Instance.Players.MyClientInstance == null) return;
#if UNITY_EDITOR
            if (Input.GetKey("r")) return;
#endif
            SendEvent(ClientEventType.INPUT_STREAM, GameManager.Instance.Players.MyClientInstance.LocalCurrentInputState);
        }

        private void SendEvent(ClientEventType type)
        {
            SendEvent(type, null);
        }

        private void SendEvent(ClientEventType type, object data)
        {
            Debug.Log("Sending " + ((int)type) + "|" + JsonConvert.SerializeObject(data));
            if (_transport.IsConnected)
                _transport.Send(((int)type) + "|" + JsonConvert.SerializeObject(data));
        }
#endregion
#region Transport Callbacks
        private void _transport_OnOpen()
        {
            Debug.LogWarning("Connection open");
            if (State == NetworkState.RECONNECTING && _lastPlayerIdOwned != null) Rejoin();
            else Join(GameManager.Instance.UIManager.GetName());
        }

        private void _transport_OnClose()
        {
            if (State == NetworkState.CONNECTED) Reconnect();
            else if (State != NetworkState.DISCONNECTING) GameManager.Instance.UIManager.ShowNetworkError();
            State = NetworkState.NOT_CONNECTED;
            Debug.LogWarning("Connection closed");
        }

        private void _transport_OnError(string errorMessage)
        {
            Debug.LogError("Connection error : "+ errorMessage);
        }

        private void _transport_OnMessage(string message)
        {
            Debug.Log("Connection message : " + message);
            int index = message.IndexOf('|');
            ServerEventType type = (ServerEventType)int.Parse(message.Substring(0, index));
            string json = message.Substring(index + 1);

            switch (type)
            {
                case ServerEventType.JOINED:
                    ApplyJoined(JsonConvert.DeserializeObject<NetworkPlayerFixedAttributes>(json));
                    break;
                case ServerEventType.INITIAL_GAME_STATE:
                    ApplyInitialGameState(JsonConvert.DeserializeObject<InitialGameState>(json));
                    break;
                case ServerEventType.LEFT:
                    ApplyLeft(JsonConvert.DeserializeObject<int>(json));
                    break;
                case ServerEventType.SPAWN:
                    GameManager.Instance.ObjectsManager.SpawnObject(JsonConvert.DeserializeObject<NetworkObjectSpawnAttributes>(json));
                    break;
                case ServerEventType.SPAWN_UNMANAGED:
                    GameManager.Instance.ObjectsManager.SpawnParticule(JsonConvert.DeserializeObject<NetworkObjectSpawnAttributes>(json));
                    break;
                case ServerEventType.DESTROY:
                    GameManager.Instance.ObjectsManager.DestroyObject(JsonConvert.DeserializeObject<int>(json));
                    break;
                case ServerEventType.HEXAGON_PROPERTY_CHANGED:
                    ApplyHexagonPropertyChanged(JsonConvert.DeserializeObject<HexagonPropertyChanged>(json));
                    break;
                case ServerEventType.GAME_STATE_STREAM:
#if UNITY_EDITOR
                    if (Input.GetKey("r")) return;
#endif
                    ApplyGameState(JsonConvert.DeserializeObject<List<NetworkPlayerGameStateStream>>(json));
                    break;
                case ServerEventType.PICKUP:
                    ApplyPickedUpObjects(JsonConvert.DeserializeObject<NetworkOwnedObjectsList>(json));
                    break;
                case ServerEventType.DROP:
                    ApplyDropObjects(JsonConvert.DeserializeObject<NetworkDropAttributes>(json));
                    break;
                default:
                    break;
            }

            _lastSeenServer = DateTime.Now;
        }
#endregion
#region Server event applications
        private void ApplyJoined(NetworkPlayerFixedAttributes clientFixedAttributes)
        {
            Debug.LogWarning("New player joined : "+clientFixedAttributes.name);
            GameManager.Instance.Players.SpawnPlayer(clientFixedAttributes);
        }

        private void ApplyInitialGameState(InitialGameState initialGameState)
        {
            Debug.LogWarning("Connected to a room!");
            State = NetworkState.CONNECTED;
            
            foreach (var playerAttribute in initialGameState.otherClientsInitialAttributes)
            {
                GameManager.Instance.Players.SpawnPlayer(playerAttribute);
            }
            foreach (var hexagonInfos in initialGameState.ownedHexagons)
            {
                Base baseToAddHexagons = GameManager.Instance.Players.NetworkedClients[hexagonInfos.id].Base;
                foreach (var hexagonPosition in hexagonInfos.hexagonList)
                {
                    GameManager.Instance.HexaGrid.SetHexagonProperty(new Vector2Int((int)hexagonPosition.x, (int)hexagonPosition.y), baseToAddHexagons);
                }
            }
            foreach (var objectAttribute in initialGameState.objects)
            {
                GameManager.Instance.ObjectsManager.SpawnObject(objectAttribute);
            }
            foreach (var playerObjectList in initialGameState.ownedObjects)
            {
                ApplyPickedUpObjects(playerObjectList);
            }
            GameManager.Instance.Players.SimulationStateStartIndex = initialGameState.simulationStateStartIndex;
            GameManager.Instance.Players.CurrentPlayerIdOwned = initialGameState.ownedClientID;
            _lastPlayerIdOwned = GameManager.Instance.Players.CurrentPlayerIdOwned;
        }

        private void ApplyPickedUpObjects(NetworkOwnedObjectsList list)
        {
            if (list.ownedObjects.Length == 0) return;
            NetworkPlayer playerToAdd = GameManager.Instance.Players.NetworkedClients[list.playerId];
            foreach (var objectID in list.ownedObjects)
            {
                playerToAdd.AttachObject(GameManager.Instance.ObjectsManager.SpawnedObjects[objectID]);
            }
        }

        private void ApplyDropObjects(NetworkDropAttributes networkDropAttributes)
        {
            if (GameManager.Instance.Players.NetworkedClients.ContainsKey(networkDropAttributes.playerId))
                GameManager.Instance.Players.NetworkedClients[networkDropAttributes.playerId].DetachAllObjects();
            foreach (var objectDropAttribute in networkDropAttributes.objectsDropped)
            {
                if(GameManager.Instance.ObjectsManager.SpawnedObjects.ContainsKey(objectDropAttribute.objectID))
                    GameManager.Instance.ObjectsManager.SpawnedObjects[objectDropAttribute.objectID].OnDrop(objectDropAttribute.newPosition);
            }
        }

        private void ApplyHexagonPropertyChanged(HexagonPropertyChanged changeInformations)
        {
            GameManager.Instance.HexaGrid.SetHexagonProperty(new Vector2Int((int)changeInformations.index.x, (int)changeInformations.index.y), (changeInformations.newOwner==-1)?null:GameManager.Instance.Players.NetworkedClients[changeInformations.newOwner].Base);
            GameManager.Instance.UIManager.Scoreboard.UpdateScores();
        }

        private void ApplyGameState(List<NetworkPlayerGameStateStream> simulationState)
        {
            foreach (var NetworkPlayerSimulationState in simulationState)
            {
                if (GameManager.Instance.Players.NetworkedClients.ContainsKey(NetworkPlayerSimulationState.id))
                    GameManager.Instance.Players.NetworkedClients[NetworkPlayerSimulationState.id].OnSimulationReceived(NetworkPlayerSimulationState.simulationState);
                else
                    Debug.LogWarning("A simulation state was sent with innexisting local player replication");
            }
        }

        private void ApplyLeft(int leftPlayerId)
        {
            GameManager.Instance.Players.RemovePlayer(leftPlayerId);
        }
#endregion
    }
}