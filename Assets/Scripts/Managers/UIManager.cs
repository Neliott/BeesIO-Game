using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    [SerializeField] GameObject _nameSelectionPannel;
    [SerializeField] InputField _nameField;
    [SerializeField] GameObject _firstPlayPannel;
    [SerializeField] GameObject _replayPannel;

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
    /// Receive the call from the play button to restart a game
    /// </summary>
    public void ClickedPlayButton()
    {
        _nameSelectionPannel.SetActive(false);
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
