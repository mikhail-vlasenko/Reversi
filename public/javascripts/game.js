function Game (player) {
    this.field = new Array(8);  // 0 - empty, 1 - blue, 2 - red
    this.player = player; // who is playing on this side (1 - blue player, 2 - red player)
    this.scoreBlue = null;
    this.scoreRed = null;

    this.reset = function (){
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

    this.makeMove = function(player, x, y) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0){
                    break;
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

    this.getAvailableMoves = function() {
        let possibleMoves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let fit = false;
                for (let dy = -1; dy <= 1 && !fit; dy++) {
                    for (let dx = -1; dx <= 1 && !fit; dx++) {
                        if (dy === 0 && dx === 0) {
                            break;
                        }
                        let hasEnemyPiece = false;
                        let curI = i + dy;
                        let curJ = j + dx;
                        while (0 <= curI < 8 && 0 <= curJ < 8) {  // while disk === opponent's color
                            if (this.field[curI][curJ] === 0) {
                                break;
                            }
                            if (this.field[curI][curJ] === (3 - player)){
                                hasEnemyPiece = true;
                            }
                            else if (hasEnemyPiece && this.field[curI][curJ] === player){
                                fit = true;
                                break;
                            }
                            i += dy;
                            j += dx;
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

    this.display = function() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let color = this.field[i][j];
                if (color !== 0) {
                    this.setCell(j, i, color);
                }
            }
        }
        let possibleMoves = this.getAvailableMoves();
        for (let i = 0; i < possibleMoves.length; i++){
            this.setCell(possibleMoves[i][1], possibleMoves[i][0], 3);
        }
    };

    this.getScore = function(){
        let blue = 0;
        let red = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.field[i][j] === 1){
                    blue++;
                }
                else if (this.field[i][j]){
                    red++;
                }
            }
        }
        return [blue, red];
    };

    this.processClick = function(event){
      //decide if the cell is active
      console.log(event);
      let coords = this.getCoords(event.id);
      console.log(coords);
      this.setCell(coords.x, coords.y, 3);
    };

    this.getCoords = function(str){
      let num = parseInt(str.slice(4));
      let x = Math.floor(num / 8);
      let y = num % 8;

      return {x:x,y:y};
    };

    this.getCell = function (x, y) {
      return document.getElementById("cell"+(x*8+y));
    };

    this.setCell = function (x, y, color) {
      let cell = this.getCell(x, y);
      if (color === 0){
        cell.children[0].className = "";
      }
      if (color === 2){
        cell.children[0].className = "red piece";
      }
      if (color === 1){
        cell.children[0].className = "blue piece";
      }
      if (color === 3){ //available
        cell.children[0].className = "available piece";
      }
    };

    this.initTable = function (){
      let i = 0;
      let id = 0;
      for (let row of document.querySelector("table").children[0].children) {
        row.className = "row";
        row.id = i;
        i++;
        for (let td of row.children) {
          td.className = "cell";
          td.id = "cell"+id;
          td.innerHTML = "<div>" + "</div>";
          id++;
          td.addEventListener("click", () => this.processClick(td));
        }
      }
    };

}

