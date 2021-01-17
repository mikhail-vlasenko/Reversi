/* eslint-disable no-undef */
let game = new Game(1);




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
            startTheGame(1);
            break;
        case messages.player2:
            console.log("I am player 2");
            startTheGame(2);
            break;
        case messages.lost1:
            break;
        case messages.lost2:
            break;
        default:
            //coordinates
            break;
    }
};
