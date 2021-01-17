/* eslint-disable no-undef */

// Below 3 could be put into another function
function startTheGame(player) {
    // player 1 (blu) always has the first move
    
    game.initTable();
    game.setScore(0,0);
    game.setTurnText(player);
    game.startTime();
    game.setPlayer(player);

    game.reset();
    game.possibleMoves = game.getAvailableMoves();

    game.display();
}

let player = 0;
var game;

var socket = new WebSocket("ws://localhost:3000");

// socket.onopen = function () {
//     //socket open
// };

socket.onmessage = function (msg) {
    let message = msg.data;
    console.log('Message received: %s', message);

    switch(message) {
        case messages.player1:
            player = 1;
            game = new Game(player);
            startTheGame(player);
            break;
        case messages.player2:
            player = 2;
            game = new Game(player);
            startTheGame(player);
            break;
        case messages.lost1:
            game.endGame(2);
            break;
        case messages.lost2:
            game.endGame(1);
            break;
        default:
            //coordinates
            game.receiveTurn(message);
            break;
    }
};
