// make a tic tac toe game
// tic tac toe board -- can be array of arrays 
// two players 'x' and 'o' 
// a method to add x's and o's 
// a way to check if someone 

var ticTacToe = function() {
    // set private vars here
    var board = [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']];
    var filled = 0;
    var player = 'x';

    // private methods -----  
    // check if game_over, function takes in the x,y of latest move
    var checkRow = function(board, x, y, player) {
        // check row
        for(var i=0;i<board[x].length;i++) {
            if(board[x][i] != player) {
                return false;
            }
        }
        return true;
    }

    var checkCol = function(board, x, y, player) {
        for(var i=0; i<board.length;i++){
            if(board[i][y] != player) {
                return false;
            }
        }
        return true;
    }

    var checkDiag = function(board, x, y, player) {
        // check if in the middle
        if(x > 0 && x < board.length-1 && y>0 && y<board[x].length-1) {
            if((board[x-1][y+1] != player) && (board[x+1][y-1] != player)) {
                return false;
            } else if((board[x-1][y-1] != player) && (board[x+1][y+1] != player)) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    var game_over_check = function(x, y, player) {
        // check if there are no more spaces in game
        if(filled==9) {
            console.log("Game over: no more boxes to fill!" + filled)
            return true;
        }
        test1 = checkRow(board, x, y, player);
        test2 = checkCol(board, x, y, player);
        test3 = checkDiag(board, x, y, player);

        console.log(test1, test2, test3);

        if(test1 || test2 || test3) {
            return true;
        } else {
            return false;
        }
        // // need to check top/bottom/left/right/ and diags for winner 
        // if(checkRow(board x, y)==true|| checkCol(board, x, y)==true || checkDiag(board, x, y) ==true) {
        //     return true;
        // } else {
        //     return false;
        // }

    }

    
    // update the board
    var update_board = function(x, y) {
        board[x][y] =  player;
        view_board();
        if(game_over_check(x, y, player)) {
            console.log("Winner is: ", player);
        } else {
            console.log("Make the next move please...");
        }
    }

    var update_player = function() {
        if(player=='x') {
            player='o';
        } else if (player=='o') {
            player='x'
        }
    }
    var view_board = function() {
            var b = "";
            for(var i=0;i<board.length;i++) {
                b += " [";
                for(var j=0;j<board[i].length;j++) {
                    b +=  board[i][j] + " " ;
                }
                b += "] \n";
            }
            console.log(b);
        }

    // public methods ----- 
    return {
        take_turn: function(x, y) {
            // return error if player chooses number not in the index
            if(x<0 || x >board[0].length) {
                console.log("not a valid position");
            } else if (y < 0 || y > board.length) {
                console.log("not a valid position");
            } else if (board[x][y]!=' ') {
                console.log("not a valid position - marked already!");
            } else if(game_over_check!=true){
                update_player();
                filled++;
                return update_board(x, y);
            }

            }
        }
        // end public methods return

}();

var t = ticTacToe;
t.take_turn(0,0) 
t.take_turn(1,1); // o 
t.take_turn(1,0); // x
t.take_turn(2,1); // o
t.take_turn(2,0); // x
t.take_turn(2,2); // needs to invalid move