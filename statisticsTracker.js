var gameStatistics = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesPlayed: 2 /* number of games played */,
    peopleInGame: 0 /* number of games running rn x2 */,
    blueWins: 1 /* total won by blue */,
    redWins: 1 /* total won by blue */
};

module.exports = gameStatistics;
