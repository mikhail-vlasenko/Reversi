function Game () {
    this.x = new Array(8); // TODO: make 2d
    this.player = null; // who is playing on this side
    this.scoreBlue = null;
    this.scoreRed = null;

    this.reset = function (){
        // TODO: reset field and other vars
    };

    this.makeMove = function(player, x, y) {
        // TODO: update the field with the move, big function
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

