let game = new Game(1);

game.initTable();

// Below 3 could be put into another function
game.setPlayer(1);
game.setScore(0,0);
game.setTurnText(1);
game.startTime();

game.reset();
game.possibleMoves = game.getAvailableMoves();

game.display();
