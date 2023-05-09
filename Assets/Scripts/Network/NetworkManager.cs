using Network.Transport;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
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

        [SerializeField] string _serverUrl;
        ITransport _transport;

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

        private void OnDestroy()
        {
            _transport.Disconnect();
        }

        /// <summary>
        /// Connect to the server to join a game
        /// </summary>
        public void Connect()
        {
            new Thread(() =>
            {
                _transport.Connect(_serverUrl);
            }).Start();
            State = NetworkState.CONNECTING;
        }

        private void _transport_OnOpen()
        {
            Debug.LogWarning("Connection open"); 
            Join(GameManager.Instance.UIManager.GetName());
        }

        private void _transport_OnClose()
        {
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
                    break;
                case ServerEventType.DESTROY:
                    break;
                case ServerEventType.GAME_STATE_STREAM:
                    break;
                case ServerEventType.PICKUP:
                    break;
                case ServerEventType.DROP:
                    break;
                default:
                    break;
            }
        }

        private void Join(string name)
        {
            State = NetworkState.CONNECTING;
            SendEvent(ClientEventType.JOIN, name);
        }

        private void ApplyJoined(NetworkPlayerFixedAttributes clientFixedAttributes)
        {
            Debug.LogWarning("New player joined : "+clientFixedAttributes.name);
            GameManager.Instance.Players.SpawnPlayer(clientFixedAttributes);
        }

        private void ApplyInitialGameState(InitialGameState initialGameState)
        {
            Debug.LogWarning("Connected to a party!");
            State = NetworkState.CONNECTED;
            GameManager.Instance.Players.ApplyInitialGameState(initialGameState);
        }

        private void ApplyLeft(int leftPlayerId)
        {
            GameManager.Instance.Players.RemovePlayer(leftPlayerId);
        }

        private void SendEvent(ClientEventType type)
        {
            SendEvent(type, null);
        }

        private void SendEvent(ClientEventType type, object data)
        {
            Debug.Log("Sending " + type);
            if (_transport.IsConnected)
                _transport.Send(((int)type) + "|" + JsonConvert.SerializeObject(data));
        }
    }
}