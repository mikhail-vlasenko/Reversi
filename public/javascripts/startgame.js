/* eslint-disable no-undef */
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



var socket = new WebSocket("ws://localhost:3000");

socket.onopen = function (event) {
    socket.send(messages.startGame);
};

socket.onmessage = function (msg) {
    let message = msg.data;
    console.log('Message received: %s', message);

    switch(message) {
        case messages.player1:
            console.log("I am player 1");
            break;
        case messages.player2:
            break;
        case messages.lost1:
            break;
        case messages.lost2:
            break;
        case messages.startGame:
            break;
        default:
            //coordinates
            break;
    }
};
