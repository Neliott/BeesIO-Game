using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using static Network.NetworkManager;

/// <summary>
/// A manager for UI component, pannel and button events.
/// </summary>
[RequireComponent(typeof(Scoreboard))]
public class UIManager : MonoBehaviour
{
    [SerializeField] GameObject _nameSelectionPannel;
    [SerializeField] InputField _nameField;
    [SerializeField] GameObject _firstPlayPannel;
    [SerializeField] GameObject _replayPannel;
    [SerializeField] Button _pickupButton;
    [SerializeField] Button _dropButton;
    [SerializeField] GameObject _connectionStatusPannel;
    [SerializeField] Text _connectionStatusText;
    [SerializeField] GameObject _connectionErrorPannel;

    Scoreboard _scoreboard;

    /// <summary>
    /// Get the scoreboard
    /// </summary>
    public Scoreboard Scoreboard { get => _scoreboard; }

    private void Awake()
    {
        GameManager.Instance.NetworkManager.OnStateChanged += NetworkManager_OnStateChanged;
        _scoreboard = GetComponent<Scoreboard>();
    }

    private void OnDestroy()
    {
        GameManager.Instance.NetworkManager.OnStateChanged -= NetworkManager_OnStateChanged;
    }

    private void NetworkManager_OnStateChanged(NetworkState obj)
    {
        _connectionStatusPannel.SetActive(obj == NetworkState.CONNECTING || obj == NetworkState.RECONNECTING || obj == NetworkState.DISCONNECTING);
        _scoreboard.IsDisplayed = obj == NetworkState.CONNECTED;
        switch (obj)
        {
            case NetworkState.CONNECTING:
                _connectionStatusText.text = "Connexion au serveur...";
                break;
            case NetworkState.RECONNECTING:
                _connectionStatusText.text = "Reconnexion à la partie...";
                break;
            case NetworkState.DISCONNECTING:
                _connectionStatusText.text = "Déconnexion...";
                break;
            default:
                _connectionStatusText.text = "";
                break;
        }
    }

    private void Update()
    {
        bool hasControlledPlayer = GameManager.Instance.Players.MyClientInstance != null;
        _pickupButton.gameObject.SetActive(hasControlledPlayer);
        _dropButton.gameObject.SetActive(hasControlledPlayer);
        if (hasControlledPlayer)
        {
            _pickupButton.interactable = GameManager.Instance.Players.MyClientInstance.CanPickupObject();
            _dropButton.interactable = GameManager.Instance.Players.MyClientInstance.PickedUpObjects().Count > 0;
        }
    }

    /// <summary>
    /// Show the name selection UI
    /// </summary>
    public void ShowNameSelection()
    {
        _nameSelectionPannel.SetActive(true);
        _firstPlayPannel.SetActive(true);
        _replayPannel.SetActive(false);
    }

    /// <summary>
    /// Show the GameOver UI screen to replay
    /// </summary>
    public void ShowGameOver()
    {
        _nameSelectionPannel.SetActive(true);
        _firstPlayPannel.SetActive(false);
        _replayPannel.SetActive(true);
    }

    /// <summary>
    /// Show a network error pannel to the user
    /// </summary>
    public void ShowNetworkError()
    {
        _nameSelectionPannel.SetActive(false);
        _connectionStatusPannel.SetActive(false);
        _scoreboard.IsDisplayed = false;
        _connectionErrorPannel.SetActive(true);
    }

    /// <summary>
    /// Receive the call from the play button to restart a game
    /// </summary>
    public void ClickedPlayButton()
    {
        _nameSelectionPannel.SetActive(false);
        GameManager.Instance.RestartGame();
    }

    /// <summary>
    /// Pickup item of the ControlledPlayer
    /// </summary>
    public void ClickedPickupButton()
    {
        GameManager.Instance.NetworkManager.SendPickupRequest();
    }

    /// <summary>
    /// Drop items of the ControlledPlayer
    /// </summary>
    public void ClickedDropButton()
    {
        GameManager.Instance.NetworkManager.SendDropRequest();
    }

    /// <summary>
    /// Get the name of the player in the input field
    /// </summary>
    /// <returns>The name</returns>
    public string GetName()
    {
        return _nameField.text;
    }
}
