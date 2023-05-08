using System;
using UnityEngine;

#if UNITY_WEBGL && !UNITY_EDITOR
using AOT;
using System.Runtime.InteropServices;
#endif

namespace Network.Transport
{
    /// <summary>
    /// A websocket transport using the native JavaScript WebSocket implementation (only available on WebGL)
    /// </summary>
    public class WebSocketJsTransport : ITransport
    {
        /* Native JSLib callbacks structure */
        private delegate void OnOpenCallback();
        private delegate void OnMessageCallback(string message);
        private delegate void OnErrorCallback();
        private delegate void OnCloseCallback(int closeCode);

#if UNITY_WEBGL && !UNITY_EDITOR
        /* Native JSLib callable functions */
        [DllImport("__Internal")]
        private static extern void WSConnect(string url, OnOpenCallback onOpen, OnMessageCallback onMessage, OnErrorCallback onError, OnCloseCallback onClose);
        [DllImport("__Internal")]
        private static extern bool WSSend(string message);
        [DllImport("__Internal")]
        private static extern int WSStatus();
        [DllImport("__Internal")]
        private static extern bool WSClose();
#endif

        /// <inheritdoc/>
        public bool IsConnected
        {
            get
            {
#if UNITY_WEBGL && !UNITY_EDITOR
                return WSStatus() == 1;
#else
                throw new Exception("This WebSocket service is only available for WebGL!");
#endif
            }
        }

        /// <inheritdoc/>
        public event Action OnOpen;
        /// <inheritdoc/>
        public event Action OnClose;
        /// <inheritdoc/>
        public event Action<string> OnMessage;
        /// <inheritdoc/>
        public event Action<string> OnError;

        private static WebSocketJsTransport _instance;

        /// <inheritdoc/>
        public void Connect(string url)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            if(_instance != null)
            {
                OnError?.Invoke("This WebSocket service can only have one instance at a time. Disconnect the last instance and then use this one.");
                return;
            }
            WSConnect(url, OpenCallback, MessageCallback, ErrorCallback, CloseCallback);
            _instance = this;
#else
            throw new Exception("This WebSocket service is only available for WebGL!");
#endif
        }

        /// <inheritdoc/>
        public void Disconnect()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            WSClose();
            _instance = null;
#else
            throw new Exception("This WebSocket service is only available for WebGL!");
#endif
        }

        /// <inheritdoc/>
        public void Send(string message)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            WSSend(message);
#else
            throw new Exception("This WebSocket service is only available for WebGL!");
#endif
        }

#if UNITY_WEBGL && !UNITY_EDITOR
        /* Callbacks from the native JSLib */
        [MonoPInvokeCallback(typeof(OnOpenCallback))]
        private static void OpenCallback()
        {
            _instance.OnOpen?.Invoke();
        }
        [MonoPInvokeCallback(typeof(OnMessageCallback))]
        private static void MessageCallback(string message)
        {
            _instance.OnMessage?.Invoke(message);
        }
        [MonoPInvokeCallback(typeof(OnErrorCallback))]
        private static void ErrorCallback()
        {
            _instance.OnError?.Invoke("An unknown error happened in the WebSocketJsTransport native side.");
        }
        [MonoPInvokeCallback(typeof(OnCloseCallback))]
        private static void CloseCallback(int errorCode)
        {
            _instance.OnClose?.Invoke();
        }
#endif
    }
}