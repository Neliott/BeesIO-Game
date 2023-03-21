using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
[RequireComponent(typeof(Scoreboard))]
public class UIManager : MonoBehaviour
{
    [SerializeField] GameObject _nameSelectionPannel;
    [SerializeField] InputField _nameField;
    [SerializeField] GameObject _firstPlayPannel;
    [SerializeField] GameObject _replayPannel;
    [SerializeField] Button _pickupButton;
    [SerializeField] Button _dropButton;

    Scoreboard _scoreboard;

    /// <summary>
    /// Get the scoreboard
    /// </summary>
    public Scoreboard Scoreboard { get => _scoreboard; }

    private void Awake()
    {
        _scoreboard = GetComponent<Scoreboard>();
    }

    private void Update()
    {
        bool hasControlledPlayer = GameManager.Instance.Players.ControlledPlayer != null;
        _pickupButton.gameObject.SetActive(hasControlledPlayer);
        _dropButton.gameObject.SetActive(hasControlledPlayer);
        if (hasControlledPlayer)
        {
            _pickupButton.interactable = GameManager.Instance.Players.ControlledPlayer.PickupController.GetCompatiblePickableObject() != null;
            _dropButton.interactable = GameManager.Instance.Players.ControlledPlayer.PickupController.GetPickedUpObjects().Count > 0;
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
        _scoreboard.IsDisplayed = false;
    }

    /// <summary>
    /// Show the GameOver UI screen to replay
    /// </summary>
    public void ShowGameOver()
    {
        _nameSelectionPannel.SetActive(true);
        _firstPlayPannel.SetActive(false);
        _replayPannel.SetActive(true);
        _scoreboard.IsDisplayed = false;
    }

    /// <summary>
    /// Receive the call from the play button to restart a game
    /// </summary>
    public void ClickedPlayButton()
    {
        _nameSelectionPannel.SetActive(false);
        _scoreboard.IsDisplayed = true;
        GameManager.Instance.RestartGame();
    }

    /// <summary>
    /// Pickup item of the ControlledPlayer
    /// </summary>
    public void ClickedPickupButton()
    {
        GameManager.Instance.Players.ControlledPlayer.PickupController.PickupLastObject();
    }

    /// <summary>
    /// Drop items of the ControlledPlayer
    /// </summary>
    public void ClickedDropButton()
    {
        GameManager.Instance.Players.ControlledPlayer.PickupController.Drop();
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
