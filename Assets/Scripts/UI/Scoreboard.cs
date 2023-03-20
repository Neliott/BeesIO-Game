using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using System.Linq;

public class Scoreboard : MonoBehaviour
{
    [SerializeField] GameObject _scoreboardPannel;
    [SerializeField] Text[] _names;
    [SerializeField] Text[] _scores;

    private bool _isDisplayed;
    private bool _needUpdate;

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

    private void Update()
    {
        if (!_needUpdate) return;
        _needUpdate = false;

        //Order players by score
        List<Player> playersOredered = GameManager.Instance.Players.Players.OrderByDescending(player => player.Base.Score).ToList();

        //Display scores
        for (int i = 0; i < _names.Length; i++)
        {
            if (i < playersOredered.Count)
            {
                _names[i].text = playersOredered[i].Base.Name;
                _scores[i].text = playersOredered[i].Base.Score + " pts";
            }
            else
            {
                _names[i].text = "";
                _scores[i].text = "";
            }
        }
    }

    /// <summary>
    /// Tell the scoreboard to refresh the next tick
    /// </summary>
    public void UpdateScores()
    {
        if (!_isDisplayed) return;
        _needUpdate = true;
    }
}
