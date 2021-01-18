function Game(player) {
    this.field = new Array(8);  // 0 - empty, 1 - blue, 2 - red
    this.player = player; // who is playing on this side (1 - blue player, 2 - red player)
    this.scoreBlue = null;
    this.scoreRed = null;
    this.myTurn = this.player === 1;  // is set to true when we get the opponent's turn from the server
    this.possibleMoves = [];
    this.gameOngoing = true;
    this.startingTime = new Date();
    this.animationsOn = true;
    this.moveSound = new Sound('../assets/sounds/moveSound.wav');

    // Resets the 2D field array back to its original state (or initialises it)
    this.reset = function () {
        for (let i = 0; i < this.field.length; i++) {
            this.field[i] = new Array(8).fill(0);
        }
        this.field[3][3] = 1;
        this.field[3][4] = 2;
        this.field[4][3] = 2;
        this.field[4][4] = 1;
        this.scoreBlue = 0;
        this.scoreRed = 0;
    };

    // Makes a move for a given player, changes the field accordingly
    this.makeMove = function (x, y, player) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                let i = x + dx;
                let j = y + dy;
                let toChange = [];
                while ((0 <= i && i < 8 && 0 <= j && j < 8) && this.field[j][i] === (3 - player)) {  // while disk === opponent's color
                    toChange.push([i, j]);
                    i += dx;
                    j += dy;
                }
                if ((0 <= i && i < 8 && 0 <= j && j < 8) && this.field[j][i] === player){
                    for (let cell of toChange){
                        this.setCell(cell[0], cell[1], player);
                    }
                }
            }
        }
    };

    // Returns all available moves for the current player
    this.getAvailableMoves = function () {
        let possibleMoves = [];
        if (!this.myTurn) return possibleMoves;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let fit = false;
                if (this.field[i][j] !== 0){ continue; }  // skip if not empty
                for (let dy = -1; dy <= 1 && !fit; dy++) {
                    for (let dx = -1; dx <= 1 && !fit; dx++) {
                        if (dy === 0 && dx === 0) {
                            continue;
                        }
                        let hasEnemyPiece = false;
                        let curI = i + dy;
                        let curJ = j + dx;
                        while (0 <= curI && curI < 8 && 0 <= curJ && curJ < 8) {
                            if (this.field[curI][curJ] === (3 - this.player)) {
                                hasEnemyPiece = true;
                            } else if (hasEnemyPiece && this.field[curI][curJ] === this.player) {
                                fit = true;
                                break;
                            } else{
                                break;
                            }
                            curI += dy;
                            curJ += dx;
                        }
                    }
                }
                if (fit) {
                    possibleMoves.push([i, j]);
                }
            }
        }
        return possibleMoves;
    };

    // Takes values of cells from the 2D array field[][] and transfers them onto the board
    this.display = function () {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let color = this.field[i][j];
                if (color !== 0) {
                    this.setCell(j, i, color);
                }
            }
        }
        this.drawPossibleMoves();
    };

    // Shows all possible moves to the player
    this.drawPossibleMoves = function () {
        this.possibleMoves = this.getAvailableMoves();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.getCell(i, j).children[0].className === "available piece") {
                    this.setCell(i, j, 0);
                }
            }
        }
        for (let i = 0; i < this.possibleMoves.length; i++) {
            this.setCell(this.possibleMoves[i][1], this.possibleMoves[i][0], 3);
        }
    };

    // Returns an object {blu, red} with the scores for each player
    this.getScore = function () {
        let blue = 0;
        let red = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.field[i][j] === 1) {
                    blue++;
                } else if (this.field[i][j]) {
                    red++;
                }
            }
        }
        return {blue:blue, red:red};
    };

    // Changes the text in the turn indicator
    this.setTurnText = function (player) {
        let turnSign = document.getElementById("turn");
        turnSign.innerHTML = player === 1 ? "Blueberry" : "Radish";
        turnSign.className = player === 1 ? "blueText" : "redText";
    };

    // Sets the score in the game screen to provided values
    this.setScore = function (player1Blue, player2Red) {
        document.getElementById("Score1").innerHTML = player1Blue;
        document.getElementById("Score2").innerHTML = player2Red;
    };

    // Gets the score via getscore and changes the DOM via setscore
    this.refreshScore = function () {
        let score = this.getScore();
        let red = score.red;
        let blue = score.blue;
        this.setScore(blue, red);
    };

    // Processes a user's click on any of the cells on the board \
    // (checks if they are available for a move and makes the move)
    this.processClick = function (event) {
        //decide if the cell is active
        let coords = this.getCoords(event.id);
        console.log(coords);
        for (let i = 0; i < this.possibleMoves.length; i++) {
            if (coords.x === this.possibleMoves[i][1] && coords.y === this.possibleMoves[i][0]) {
                console.log('Move made');
                this.makeMove(coords.x, coords.y, this.player);
                this.setCell(coords.x, coords.y, this.player);
                this.refreshScore();
                this.myTurn = false;
                this.setTurnText(3-player);
                this.drawPossibleMoves();
                this.moveSound.play();
                socket.send(coords.x.toString() + coords.y.toString());
                return;
            }
        }
    };

    // is called when the opponent's turn is received, updates the local state accordingly
    this.receiveTurn = function (message) {
        let x = parseInt(message.charAt(0));
        let y = parseInt(message.charAt(1));
        this.makeMove(x, y, 3 - this.player);
        this.setCell(x, y, 3 - this.player);
        this.refreshScore();
        this.myTurn = true;
        this.setTurnText(player);
        this.drawPossibleMoves();
        //No moves (lost):
        if (this.possibleMoves.length === 0) {
            let score = this.getScore();
            let loser = 2;
            if (score.blue < score.red){
                loser = 1;
            }
            this.endGame((3 - loser));
            socket.send("Lost"+loser);
        }
    };

    //Gets coords from strings like "cell23" (which are ids of the cells in the table)
    this.getCoords = function (str) {
        let num = parseInt(str.slice(4));
        let x = Math.floor(num / 8);
        let y = num % 8;

        return {x: x, y: y};
    };

    // Returns a cell from given coordinates (from the document)
    this.getCell = function (x, y) {
        return document.getElementById("cell" + (x * 8 + y));
    };

    // Animates a cell to rotate to a given color from an opposite color
    this.animateCellTo = function (x, y, color) {
        let cell = this.getCell(x, y).children[0];
        if (color === "red" || color===2){
            cell.classList.remove("blue");
            cell.classList.add("animateToRed");
            let randomId = new Date().getTime();
            let data = "../assets/animations/bluetoRed1loop.gif";
            cell.style.backgroundImage = "url(" + data + "?random=" + randomId + ")";
            setTimeout(() => {
                cell.classList.add("red");
                cell.classList.remove("animateToRed");
                cell.style = null;
            }, 900);
        }
        else if (color === "blue" || color===1){
            cell.classList.remove("red");
            cell.classList.add("animateToBlue");
            let randomId = new Date().getTime();
            let data = "../assets/animations/redtoBlue1loop.gif";
            cell.style.backgroundImage = "url(" + data + "?random=" + randomId + ")";
            setTimeout(() => {
                cell.classList.add("blue");
                cell.classList.remove("animateToBlue");
                cell.style = null;
            }, 900);
        }
    };

    // Sets a cell with coordinates x,y to be a color 0-3 
    this.setCell = function (x, y, color) {
        let cell = this.getCell(x, y);
        if (color === 0) {
            cell.children[0].className = "";
            this.field[y][x] = 0;
        }
        if (color === 2) {
            //check if animation:
            if (cell.children[0].classList.contains("blue") && this.animationsOn){
                console.log("animation");
                this.animateCellTo(x,y, "red");
            }
            else{
                cell.children[0].className = "red piece";
            }
            this.field[y][x] = 2;
        }
        if (color === 1) {
            //check if animation:
            if (cell.children[0].classList.contains("red") && this.animationsOn){
                console.log("animation");
                this.animateCellTo(x,y, "blue");
            }
            else{
                cell.children[0].className = "blue piece";
            }
            this.field[y][x] = 1;
        }
        if (color === 3) { //available
            cell.children[0].className = "available piece";
        }
    };

    // Changes the value of the playername
    this.setPlayer = function (player) {
        let playername = document.getElementById("playerName");
        playername.innerHTML = player === 1 ? "Blueberry" : "Radish";
        playername.className = player === 1 ? "blueText" : "redText";
    };

    // Starts the time passed stopwatch
    this.startTime = function (){
        let timer = setInterval(() => {
            let endTime = new Date();
            let timeDiff = endTime - this.startingTime;
            let seconds = Math.floor((timeDiff / 1000) % 60),
            minutes = Math.floor((timeDiff / (1000 * 60)));
            document.getElementById("time").innerHTML = minutes + ":" + (seconds < 10 ? "0"+seconds : seconds);
            if (!this.gameOngoing){ 
                clearInterval(timer);
            }
        }, 1000);

    };

    // Sets IDs for all rows and cells in the game table
    this.initTable = function () {
        let i = 0;
        let id = 0;
        for (let row of document.querySelector("table").children[0].children) {
            row.className = "row";
            row.id = i;
            i++;
            for (let td of row.children) {
                td.className = "cell";
                td.id = "cell" + id;
                td.innerHTML = "<div>" + "</div>";
                id++;
                td.addEventListener("click", () => this.processClick(td));
            }
        }
        document.getElementById("gameScreen").className ="";
        document.getElementById("waiting").className ="hidden";
    };

    // Ends the game taking the player who won as an argument
    this.endGame = function (player){
        this.gameOngoing = false;
        document.getElementById("gametitle").innerHTML = (player === this.player ? "You won the game!" : "You lost :(");
    };
}

    // Stops the game if the opponent disconnected
    this.abortGame = function () {
        document.getElementById("gameScreen").className ="hidden";
        document.querySelector("#waiting h1").innerHTML = "Your opponent has disconnected, <a href='/'>Play again</a>";
        document.getElementById("waiting").className = "";
    };

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
}

