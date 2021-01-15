function Game (player) {
    this.field = new Array(8);  // 0 - empty, 1 - blue, 2 - red
    this.player = player; // who is playing on this side (1 - blue player, 2 - red player)
    this.scoreBlue = null;
    this.scoreRed = null;

    this.reset = function (){
        for (let i = 0; i < this.field.length; i++) {
            this.field[i] = new Array(8).fill(0);
        }
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

    this.availableMoves = function() {
        // TODO: return an array with coordinates of moves that can be played now by this player
    };

    this.display = function() {
        // TODO: update the current field in html
    };

    this.getScore = function(){
        // TODO: return score
    };

    this.getCell = function (x, y) {
      return document.getElementById("cell"+(x*8+y));
    };

    this.setCell = function (x, y, color) {
      let cell = this.getCell(x, y);
      if (color === "red"){
        cell.children[0].className = "red";
      }
      if (color === "blue"){
        cell.children[0].className = "red";
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
        }
      }
    };

}

