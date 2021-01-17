var gameStatistics = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesPlayed: 0 /* number of games played */,
    peopleInGame: 0 /* number of games running rn x2 */,
    blueWins: 0 /* games won by blue */,
    redWins: 0 /* games won by red */
  };

  module.exports = gameStatistics;
