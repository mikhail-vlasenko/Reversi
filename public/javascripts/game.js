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

    this.setCell = function (x, y, color) {
      
    };

}

