using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Network
{
    /// <summary>
    /// A player managed by a remote server
    /// </summary>
    public class NetworkPlayer : MonoBehaviour
    {
        public NetworkPlayerFixedAttributes FixedAttributes { get; private set; }

        /// <summary>
        /// Is this network client owned by the local machine ?
        /// </summary>
        public bool IsMine { get; private set; }

        [SerializeField] SpriteRenderer _coloredRenderer;

        #region Network setup

        /// <summary>
        /// Setup the network client
        /// </summary>
        /// <param name="fixedAttributes">Set the fixed start attributes</param>
        public void NetworkSetup(NetworkPlayerFixedAttributes fixedAttributes)
        {
            FixedAttributes = fixedAttributes;
            _coloredRenderer.color = Color.HSVToRGB(fixedAttributes.colorHue/360f, 1, 1f);
            transform.position = fixedAttributes.basePosition.ToVector2();
        }

        /// <summary>
        /// Setup the network client if it will be used as the local network client
        /// </summary>
        /// <param name="startSimulationFrame">The starting simulation frame (cannot be 0 if it is a reconnection)</param>
        public void AdditionnalNetworkSetupForOwnedClient(int startSimulationFrame)
        {
            IsMine = true;
        }
        #endregion
    }
}