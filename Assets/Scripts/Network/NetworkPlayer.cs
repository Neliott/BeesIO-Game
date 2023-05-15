using UnityEngine;

namespace Network
{
    /// <summary>
    /// A player managed by a remote server.
    /// This use client side prediction to have fmore fluid movements (without ping rollback) in a server autoritative environnement.
    /// Based on https://medium.com/@christian.tucker_68732/seamless-fast-paced-multiplayer-in-unity3d-implementing-client-side-prediction-ab520bf49bd1
    /// </summary>
    public class NetworkPlayer : MonoBehaviour
    {
        /// <summary>
        /// The maximum cache size for both the ClientInputState and NetworkPlayerSimulationState caches. This correspond to 10 seconds caching at 10 network ticks / second.
        /// </summary>
        const int STATE_CACHE_SIZE = 100;
        /// <summary>
        /// The amount of smoothing when rotating the player
        /// </summary>
        const float SMOOTH_DIRECTION = .4f;
        /// <summary>
        /// The target speed for a player (need to be sync with the server for client side prediction)
        /// </summary>
        const float SPEED = 6.5f;
        /// <summary>
        /// The tolerance between the cached position and the server computed one. If the distance is greater, the player will move to the correct one.
        /// </summary>
        const float RECONCILIATION_DISTANCE_TOLERANCE = 0.01f;

        /// <summary>
        /// Get the player initial fixed attributes
        /// </summary>
        public NetworkPlayerFixedAttributes FixedAttributes { get; private set; }
        
        /// <summary>
        /// The client's current ClientInputState. 
        /// </summary>
        public NetworkPlayerInputState LocalCurrentInputState { get; private set; }

        /// <summary>
        /// The client's current simulation frame. 
        /// </summary>
        public int LocalSimulationFrame { get; private set; }

        /// <summary>
        /// Is this network client owned by the local machine ?
        /// </summary>
        public bool IsMine { get; private set; }

        /// <summary>
        /// Get the base of this player
        /// </summary>
        public Base Base { get; private set; }

        /// <summary>
        /// The boty of the player (to apply color to)
        /// </summary>
        [SerializeField] SpriteRenderer _coloredRenderer;

        /// <summary>
        /// The base prefab model to spawn
        /// </summary>
        [SerializeField] Base _basePrefab;

        /// <summary>
        /// The last known NetworkPlayerSimulationState provided by the server. 
        /// </summary>
        NetworkPlayerSimulationState _serverSimulationState;

        /// <summary>
        /// The cache that stores all of the client's predicted movement reuslts. 
        /// </summary>
        NetworkPlayerSimulationState[] _simulationStateCache = new NetworkPlayerSimulationState[STATE_CACHE_SIZE];

        /// <summary>
        /// The cache that stores all of the client's inputs. 
        /// </summary>
        NetworkPlayerInputState[] _inputStateCache = new NetworkPlayerInputState[STATE_CACHE_SIZE];

        /// <summary>
        ///  The last simulationFrame that we Reconciled from the server. 
        /// </summary>
        int _lastCorrectedSimulationFrame;

        /// <summary>
        /// The last position computed on network tick (this is used to rollback the extrapolation on the Update function)
        /// </summary>
        Vector2 _lastPositionOnNetworkTick = new Vector2();

        /// <summary>
        /// The current rotation velocity (used for smooth damp)
        /// </summary>
        float _velocity;

        /// <summary>
        /// The current direction
        /// </summary>
        float _currentDirection;

        #region Network Input
        /// <summary>
        /// Setup the network client
        /// </summary>
        /// <param name="fixedAttributes">Set the fixed start attributes</param>
        public void NetworkSetup(NetworkPlayerFixedAttributes fixedAttributes)
        {
            FixedAttributes = fixedAttributes;
            Base = Instantiate(_basePrefab, fixedAttributes.basePosition.ToVector2(), Quaternion.identity);
            Base.Setup(fixedAttributes);
            _coloredRenderer.color = Base.Color;
            _lastPositionOnNetworkTick = fixedAttributes.basePosition.ToVector2();
            transform.position = _lastPositionOnNetworkTick;
        }

        /// <summary>
        /// Setup the network client if it will be used as the local network client
        /// </summary>
        /// <param name="startSimulationFrame">The starting simulation frame (cannot be 0 if it is a reconnection)</param>
        public void AdditionnalNetworkSetupForOwnedClient(int startSimulationFrame)
        {
            IsMine = true; 
            LocalSimulationFrame = startSimulationFrame;
            _lastCorrectedSimulationFrame = startSimulationFrame;
        }
        
        /// <summary>
        /// Give the player a new simulation state validated from the server
        /// </summary>
        /// <param name="state">The new corrected and autoritative simulation state received</param>
        public void OnSimulationReceived(NetworkPlayerSimulationState state)
        {
            // Only register newer SimulationState's. 
            if (_serverSimulationState == null || _serverSimulationState.simulationFrame < state.simulationFrame)
            {
                _serverSimulationState = state;
            }
        }
        #endregion
        #region Client side prediction

        /// <summary>
        /// Tick the network client (process input and apply it)
        /// </summary>
        public void NetworkTick()
        {
            transform.position = _lastPositionOnNetworkTick;
            if (IsMine) LocalNetworkTick();
            else ProxyNetworkTick();
            _lastPositionOnNetworkTick = transform.position;
        }

        /// <summary>
        /// Tick the local client only (process input and apply it)
        /// </summary>
        void LocalNetworkTick()
        {
            // Reconciliate if there's a message from the server.
            if (_serverSimulationState != null) Reconciliate();

            LocalCurrentInputState = new NetworkPlayerInputState(LocalSimulationFrame, _currentDirection);

            NetworkPlayerSimulationState state = ProcessInput(LocalCurrentInputState);

            int index = LocalSimulationFrame % STATE_CACHE_SIZE;

            _simulationStateCache[index] = state;
            _inputStateCache[index] = LocalCurrentInputState;

            LocalSimulationFrame++;
        }

        /// <summary>
        /// A simple network tick if the client is not owned (only apply the last simulation state received)
        /// </summary>
        /// <remarks>Can be improved for deleting decaled tick error</remarks>
        void ProxyNetworkTick()
        {
            if (_serverSimulationState == null) return;
            if (LocalSimulationFrame < _serverSimulationState.simulationFrame)
            {
                LocalSimulationFrame = _serverSimulationState.simulationFrame;
                ApplySimulationState(_serverSimulationState);
            }
        }

        /// <summary>
        /// Reconcilliate a new server simulation state (can only be verified, not necessary corrected)
        /// </summary>
        void Reconciliate()
        {
            // Sanity check, don't reconciliate for old states.
            if (_serverSimulationState.simulationFrame <= _lastCorrectedSimulationFrame) return;

            // Determine the cache index 
            int cacheIndex = (_serverSimulationState.simulationFrame % STATE_CACHE_SIZE);

            // Obtain the cached input and simulation states.
            NetworkPlayerInputState cachedInputState = _inputStateCache[cacheIndex];
            NetworkPlayerSimulationState cachedSimulationState = _simulationStateCache[cacheIndex];

            // If there's missing cache data for either input or simulation 
            // snap the player's position to match the server.
            if (cachedInputState == null || cachedSimulationState == null)
            {
                ApplySimulationState(_serverSimulationState);
            }
            else if (NeedReconciliation(cachedSimulationState, _serverSimulationState))
            {
                ReapplyInputsFromLastServerState();
            }

            // Once we're complete, update the lastCorrectedFrame to match.
            // NOTE: Set this even if there's no correction to be made. 
            _lastCorrectedSimulationFrame = _serverSimulationState.simulationFrame;
        }

        /// <summary>
        /// Reapply all inputs from the last corrected server state.
        /// Used when the last server state didn't correspond to the cached one.
        /// We need to reapply the correct one and fix the cascade of next invalidated states by reapplying them.
        /// </summary>
        void ReapplyInputsFromLastServerState()
        {
            // Set the player's position to match the server's state. 
            ApplySimulationState(_serverSimulationState);

            // Declare the rewindFrame as we're about to resimulate our cached inputs.
            int rewindFrame = _serverSimulationState.simulationFrame;

            // Loop through and apply cached inputs until we're 
            // caught up to our current simulation frame. 
            while (rewindFrame < LocalSimulationFrame)
            {
                // Determine the cache index 
                int rewindCacheIndex = rewindFrame % STATE_CACHE_SIZE;

                // Obtain the cached input and simulation states.
                NetworkPlayerInputState rewindCachedInputState = _inputStateCache[rewindCacheIndex];
                NetworkPlayerSimulationState rewindCachedSimulationState = _simulationStateCache[rewindCacheIndex];

                // If there's no state to simulate, for whatever reason, 
                // increment the rewindFrame and continue.
                if (rewindCachedInputState == null || rewindCachedSimulationState == null)
                {
                    Debug.LogError("Rewind cache null!");
                    ++rewindFrame;
                    continue;
                }

                // Process the cached inputs. 
                if (rewindFrame != _serverSimulationState.simulationFrame)
                {
                    // Replace the simulationStateCache index with the new value.
                    _simulationStateCache[rewindCacheIndex] = ProcessInput(rewindCachedInputState);
                }
                else
                {
                    _simulationStateCache[rewindCacheIndex] = _serverSimulationState;
                }
                // Increase the amount of frames that we've rewound.
                ++rewindFrame;
            }
        }
        #endregion
        #region Movement implementation
        /// <summary>
        /// Update this player (this is used to extrapolate the current informations to have more smoothness)
        /// </summary>
        void Update()
        {
            if (IsMine) LocalExtrapolation();
            else ProxyExtrapolation();
        }

        /// <summary>
        /// Compute the next frames with fresh inputs (only the local owned client)
        /// </summary>
        void LocalExtrapolation()
        {
            _currentDirection = ComputeDirection(_currentDirection , GetLocalMouseDirection(), SMOOTH_DIRECTION, Time.deltaTime);
            SetDirection(_currentDirection);
            Move(Time.deltaTime);
        }

        /// <summary>
        /// Extrapolate the last server simulation state received for an other player.
        /// </summary>
        void ProxyExtrapolation()
        {
            if (_serverSimulationState == null) return;
            SetDirection(_serverSimulationState.direction);
            Move(Time.deltaTime);
            _currentDirection = ComputeDirection(_currentDirection, _serverSimulationState.direction, SMOOTH_DIRECTION / NetworkManager.CLIENT_TICK_PER_SECOND, Time.deltaTime);
            SetDirection(_currentDirection);
        }

        /// <summary>
        /// Process the input
        /// </summary>
        /// <param name="inputState">The input to process immediately</param>
        /// <returns>The new simulation state calculated locally (predicted)</returns>
        NetworkPlayerSimulationState ProcessInput(NetworkPlayerInputState inputState)
        {
            SetDirection(inputState.direction);
            Move(NetworkManager.CLIENT_TICK_INTERVAL);
            return new NetworkPlayerSimulationState
            {
                position = new Position(transform.position),
                direction = inputState.direction,
                simulationFrame = inputState.simulationFrame
            };
        }

        /// <summary>
        /// Apply immediately the given simulation state
        /// </summary>
        /// <param name="simulationState">The simulation state to apply</param>
        void ApplySimulationState(NetworkPlayerSimulationState simulationState)
        {
            SetDirection(simulationState.direction);
            transform.position = simulationState.position.ToVector2();
        }

        /// <summary>
        /// Is a reconciliation needed the the given simulation states ?
        /// </summary>
        /// <param name="cachedSimulationState">The cached simulation state</param>
        /// <param name="serverSimulationState">The correct server simulation state</param>
        /// <returns>True if the cachedSimulationState is too incorrectly far</returns>
        bool NeedReconciliation(NetworkPlayerSimulationState cachedSimulationState, NetworkPlayerSimulationState serverSimulationState)
        {
            float distance = Vector2.Distance(cachedSimulationState.position.ToVector2(), serverSimulationState.position.ToVector2());

            //  The amount of distance in units that we will allow the client's
            //  prediction to drift from it's position on the server, before a
            //  correction is necessary. 
            if (distance > RECONCILIATION_DISTANCE_TOLERANCE)
            {
                Debug.Log("Reconciliate : " + distance);
            }
            return distance > RECONCILIATION_DISTANCE_TOLERANCE;
        }

        /// <summary>
        /// Get the mouse direction in angle relative to the center of the screen
        /// </summary>
        /// <returns>The mouse direction in degree</returns>
        float GetLocalMouseDirection()
        {
            //The mouse relative pixels difference from the player
            Vector3 mouseRelativePosition = Input.mousePosition - new Vector3(Screen.width / 2, Screen.height / 2, 0);
            //Convert the mouse relative vector to an angle
            return Mathf.Atan2(mouseRelativePosition.y, mouseRelativePosition.x) * Mathf.Rad2Deg;
        }

        /// <summary>
        /// Get the new smoothed direction from given parameters
        /// </summary>
        /// <param name="lastDirection">The last computed direction</param>
        /// <param name="targetDirection">The target direction</param>
        /// <param name="smoothTime">The amount of smoothness to apply</param>
        /// <param name="deltaTime">The deltaTime step</param>
        /// <returns>The smoothed direction</returns>
        float ComputeDirection(float lastDirection, float targetDirection, float smoothTime, float deltaTime)
        {
            float dampedAngle = Mathf.SmoothDampAngle(lastDirection, targetDirection, ref _velocity, smoothTime, Mathf.Infinity, deltaTime);
            return dampedAngle % 360;
        }

        /// <summary>
        /// Move forward (relative to the rotation)
        /// </summary>
        /// <param name="deltaTime">The delta time step (amount)</param>
        void Move(float deltaTime)
        {
            transform.position += transform.right * SPEED * deltaTime;
        }

        /// <summary>
        /// Set the transform direction
        /// </summary>
        /// <param name="direction">The direction to lookat</param>
        void SetDirection(float direction)
        {
            transform.rotation = Quaternion.Euler(new Vector3(0, 0, direction));
        }
        #endregion
    }
}