using System;

namespace Network.Transport
{
    /// <summary>
    /// Interface used in NetworkManager that all transport implementations must inherit
    /// </summary>
    public interface ITransport
    {
        public void Connect(string url);
        public void Disconnect();
        public bool IsConnected { get; }
        public void Send(string message);
        public event Action OnOpen;
        public event Action OnClose;
        public event Action<string> OnMessage;
        public event Action<string> OnError;
    }
}