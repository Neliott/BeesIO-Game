using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using WebSocketSharp;

namespace Network.Transport
{
    /// <summary>
    /// A websocket transport using the WebSocketSharp library (can be used on all platforms except WebGL)
    /// </summary>
    class WebSocketSharpTransport : ITransport
    {
        private WebSocket _ws;
        /// <inheritdoc/>
        public bool IsConnected => _ws.ReadyState == WebSocketState.Open;

        /// <inheritdoc/>
        public event Action OnOpen;
        /// <inheritdoc/>
        public event Action OnClose;
        /// <inheritdoc/>
        public event Action<string> OnMessage;
        /// <inheritdoc/>
        public event Action<string> OnError;

        /// <inheritdoc/>
        public void Connect(string url)
        {
            _ws = new WebSocket(url);
            _ws.OnMessage += _ws_OnMessage;
            _ws.OnOpen += _ws_OnOpen;
            _ws.OnError += _ws_OnError;
            _ws.OnClose += _ws_OnClose;
            _ws.Connect();
        }

        private void _ws_OnClose(object sender, CloseEventArgs e)
        {
            _ws.OnMessage -= _ws_OnMessage;
            _ws.OnOpen -= _ws_OnOpen;
            _ws.OnError -= _ws_OnError;
            _ws.OnClose -= _ws_OnClose;
            UnityMainThreadDispatcher.Instance.Enqueue(() => OnClose?.Invoke());
        }

        private void _ws_OnError(object sender, ErrorEventArgs e)
        {
            UnityMainThreadDispatcher.Instance.Enqueue(() => OnError?.Invoke(e.Message));
        }

        private void _ws_OnOpen(object sender, EventArgs e)
        {
            UnityMainThreadDispatcher.Instance.Enqueue(() => OnOpen?.Invoke());
        }

        private void _ws_OnMessage(object sender, MessageEventArgs e)
        {
            UnityMainThreadDispatcher.Instance.Enqueue(() => OnMessage?.Invoke(e.Data));
        }

        /// <inheritdoc/>
        public void Disconnect()
        {
            _ws.Close();
        }

        /// <inheritdoc/>
        public void Send(string message)
        {
            _ws.Send(message);
        }
    }
}