var express = require('express');
var router = express.Router();
var gameStatistics = require("../statisticsTracker");

/* GET home page. */
router.get('/', function (req, res) {
    res.render('splash', {
        title: 'Reversi',
        gamesPlayed: gameStatistics.gamesPlayed,
        peopleInGame: gameStatistics.peopleInGame,
        blueWins: gameStatistics.blueWins,
        redWins: gameStatistics.redWins
    });
});

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function (req, res) {
    res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
