function Game(player) {
    this.field = new Array(8);  // 0 - empty, 1 - blue, 2 - red
    this.player = player; // who is playing on this side (1 - blue player, 2 - red player)
    this.scoreBlue = null;
    this.scoreRed = null;

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
    this.makeMove = function (player, x, y) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) {
                    continue;
                }
                let i = y + dy;
                let j = x + dx;
                while (this.field[i][j] === (3 - player)) {  // while disk === opponent's color
                    this.field[i][j] = player;
                    i += dy;
                    j += dx;
                }
            }
        }
    };

    // Returns all available moves for the current player
    this.getAvailableMoves = function () {
        let possibleMoves = [];
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
        let possibleMoves = this.getAvailableMoves();
        for (let i = 0; i < possibleMoves.length; i++) {
            this.setCell(possibleMoves[i][1], possibleMoves[i][0], 3);
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

    // Processes a user's click on any of the cells on the board \
    // (checks if they are available for a move and makes the move)
    this.processClick = function (event) {
        //decide if the cell is active
        console.log(event);
        let coords = this.getCoords(event.id);
        console.log(coords);

        let possibleMoves = this.getAvailableMoves();
        console.log(possibleMoves);
        for (let i = 0; i < possibleMoves.length; i++) {
            if (coords.x === possibleMoves[i][1] && coords.y === possibleMoves[i][0]) {
                console.log('valid action');
                // TODO: Make a move that is saved in field
                this.setCell(coords.x, coords.y, this.player);
                return;
            }
        }
        console.log('invalid action');
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

    // Sets a cell with coordinates x,y to be a color 0-3 
    this.setCell = function (x, y, color) {
        let cell = this.getCell(x, y);
        if (color === 0) {
            cell.children[0].className = "";
            this.field[y][x] = 0;
        }
        if (color === 2) {
            cell.children[0].className = "red piece";
            this.field[y][x] = 2;
        }
        if (color === 1) {
            cell.children[0].className = "blue piece";
            this.field[y][x] = 1;
        }
        if (color === 3) { //available
            cell.children[0].className = "available piece";
        }
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
    };

}

