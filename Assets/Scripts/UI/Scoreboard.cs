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
        if (!_isDisplayed) return;
        List<(string, int)> scores = new List<(string, int)>();
        foreach (var player in GameManager.Instance.Players.Players)
        {
            scores.Add((player.Base.Name, player.Base.Score));
        }
        List<(string, int)> scoresOrdered = scores.OrderByDescending(score => score.Item2).ToList();
        for (int i = 0; i < _names.Length; i++)
        {
            if(i < scoresOrdered.Count)
            {
                _names[i].text = scoresOrdered[i].Item1;
                _scores[i].text = scoresOrdered[i].Item2+ " pts";
            }
            else
            {
                _names[i].text = ""; 
                _scores[i].text = "";
            }
        }
    }
}
