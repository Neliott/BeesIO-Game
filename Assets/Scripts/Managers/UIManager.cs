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

    Scoreboard _scoreboard;

    private void Awake()
    {
        _scoreboard = GetComponent<Scoreboard>();
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
    /// Get the name of the player in the input field
    /// </summary>
    /// <returns>The name</returns>
    public string GetName()
    {
        return _nameField.text;
    }
}
