let game = new Game(1);

game.initTable();

// Below 3 could be put into another function
game.setPlayer(1);
game.setScore(0,0);
game.setTurn(1);


game.reset();


game.display();
