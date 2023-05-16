using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Network;
using System.Linq;
using NetworkPlayer = Network.NetworkPlayer;

public class Scoreboard : MonoBehaviour
{
    [SerializeField] GameObject _scoreboardPannel;
    [SerializeField] Text[] _names;
    [SerializeField] Text[] _scores;

    private bool _isDisplayed;

    /// <summary>
    /// Get / Set if the scoreboard is displayed
    /// </summary>
    public bool IsDisplayed
    {
        get { return _isDisplayed; }
        set { 
            _isDisplayed = value;
            _scoreboardPannel.SetActive(_isDisplayed);
        }
    }

    /// <summary>
    /// Tell the scoreboard to refresh the next tick
    /// </summary>
    public void UpdateScores()
    {
        if (!_isDisplayed) return;
        //Order players by score
        List<NetworkPlayer> playersOredered = GameManager.Instance.Players.NetworkedClients.Values.OrderByDescending(player => GameManager.Instance.HexaGrid.GetHexagonsOfBase(player.Base).Count).ToList();

        //Display scores
        for (int i = 0; i < _names.Length; i++)
        {
            if (i < playersOredered.Count)
            {
                _names[i].text = playersOredered[i].FixedAttributes.name;
                _scores[i].text = GameManager.Instance.HexaGrid.GetHexagonsOfBase(playersOredered[i].Base).Count + " pts";
            }
            else
            {
                _names[i].text = "";
                _scores[i].text = "";
            }
        }
    }
}
