using System;

namespace Network.Transport
{
    /// <summary>
    /// Interface used in NetworkManager that all transport implementations must inherit
    /// </summary>
    public interface ITransport
    {
        /// <summary>
        /// Connect to a server
        /// </summary>
        /// <param name="url">The url to connect to</param>
        public void Connect(string url);
        /// <summary>
        /// Disconnect from the server
        /// </summary>
        public void Disconnect();
        /// <summary>
        /// Is the transport connected to the server
        /// </summary>
        public bool IsConnected { get; }
        /// <summary>
        /// Send a message to the server
        /// </summary>
        /// <param name="message">The message to send</param>
        public void Send(string message);
        /// <summary>
        /// Event fired when the transport is connected to the server
        /// </summary>
        public event Action OnOpen;
        /// <summary>
        /// Event fired when the transport is disconnected from the server
        /// </summary>
        public event Action OnClose;
        /// <summary>
        /// Event fired when a message is received from the server
        /// </summary>
        public event Action<string> OnMessage;
        /// <summary>
        /// Event fired when an error occurs
        /// </summary>
        public event Action<string> OnError;
    }
}