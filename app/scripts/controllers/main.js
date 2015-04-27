'use strict';

/**
 * @ngdoc function
 * @name tictactoeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tictactoeApp
 */
angular.module('tictactoeApp')
  .controller('MainCtrl', ['$scope' , function ($scope) {

    // on load, generate a 9-tiled board
    $scope.filled = 0;
    $scope.player = '';
    $scope.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    $scope.winner;
    $scope.gameOver = false;

    $scope.checkRow = function(board, x, y, player) {
        for(var i=0; i<board[x].length; i++) {
            if(board[x][i]!=player) {
                return false;
            }
        }
        return true;
    }

    $scope.checkCol = function(board, x, y, player) {
        for(var i=0; i<board.length;i++){
            if(board[i][y] != player) {
                return false;
            }
        }
        return true;
    }

    // this doesn't actually check correctly!!! 
    $scope.checkDiag = function(board, x, y, player) {
        if(board[0][0] != ' ') {
            if(board[0][0]== player && board[1][1] == player && board[2][2] == player) {
                return true;
            }
        } else if (board[0][2] != ' ') {
            if(board[0][2] == player && board[1][1] == player && board[2][0] == player) {
                return true;
            }
        } else {
            return false;
        }
    }

    $scope.gameOverCheck = function(x, y, player, board) {
        // check if there are no more spaces in game
        if($scope.filled==9) {
            $scope.gameOver = true;
            $scope.winner = 'None';
        }
        var test1 = $scope.checkRow(board, x, y, player);
        var test2 = $scope.checkCol(board, x, y, player);
        var test3 = $scope.checkDiag(board, x, y, player);

        if(test1 || test2 || test3) {
            $scope.gameOver = true;
        } else {
            $scope.gameOver = false;
        }
    }

    // update the board
    $scope.updateBoard = function(x, y) {
        // update the board 
        $scope.board[x][y] =  $scope.player;
        $scope.filled++;
        var id = String(x) + String(y);
        $scope.changeTile(id, $scope.player);
        
        // evaluate the board for winner
        $scope.gameOverCheck(x, y, $scope.player, $scope.board);

        if($scope.gameOver) {
            $scope.winner = $scope.winner || $scope.player; // this doesn't account for ties
        }
        
    }

    $scope.updatePlayer = function() {
        // new game -- start with o
        if($scope.player=='') {
            $scope.player = 'o';
        }

        // else switch between o and x
        if($scope.player=='x') {
            $scope.player='o';
        } else if ($scope.player=='o') {
            $scope.player='x'
        }
    }

    $scope.resetBoard = function() {
        $scope.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    }

    $scope.changeTile = function(id, player) {
        var $currentTile = $('.tile#' + id + ' div');
        $currentTile.addClass('player_' + player);
    }

    $scope.play = function(x, y) {
        // check if game over ... 
        if(!$scope.gameOver) {
            // return error if player chooses number not in the index    
            if( x< 0 || x > $scope.board[0].length-1) {
                throw new Error('not a valid position');
            } else if (y < 0 || y > $scope.board.length-1) {
                throw new Error('not a valid position');
            } else if ( $scope.board[x][y]!=' ') {
                throw new Error('not a valid position - marked already!');
            } else {
                $scope.updatePlayer();
                $scope.updateBoard(x, y);
            }
        } else {
            throw new Error('dont update');
        }
        
    };

    // my attempt at a minimax algorithm implementation 
    // for tictactoe in javascript
    $scope.miniMax = {
    COMPUTER_WIN : 1,
    DRAW : 0,
    HUMAN_WIN : -1,
    myBest: {}, // var best = {'score': undefined, 'move': undefined};
    reply: {},
    board: [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']],
    side: 'COMPUTER',
    winner: '',
    chooseMove : function(side) {
        var moves = this.legalMoves(this.board);
        // check if game is over 
        if(this.myBest.move && this.gameOver(this.myBest.move)) {
            return this.myBest;
        }

        if(this.side=='COMPUTER') {
            this.myBest.score = -2;
        } else {
            this.myBest.score = 2;
        }

        for(var i=0;i<moves.length;i++) {
            this.performMove(moves[i]);
            otherside = this.not(this.side);
            this.reply = this.chooseMove(otherside);
            this.undoMove(moves[i]);
            if(((this.side=='COMPUTER') && (this.reply.score > this.myBest.score)) || ((this.side=='HUMAN') && (this.reply.score < this.myBest.score))) {
                this.myBest.move = moves[i];
                this.myBest.score = this.reply.score;
            }
        }
        // return best move and score
        return this.myBest; 
    },
    not: function(side) {
        if(side=='COMPUTER') {
            this.side = 'HUMAN';
        } else {
            this.side = 'COMPUTER';
        }
    },
    performMove: function(move) {
        // runs a move that modifies 'this' grid
        // and updates the score for myBest or reply variables.... 
        // @param: move, an array of length 2 [x, y] coordinates of the board
        // evaluates the board 
        this.board[move[0]][move[1]] = this.side;
        this.evaluateBoard(move);
    },
    undoMove: function(move) {
        // undoes the move so that it restores 'this' grid
        // @param: move, an array of length 2 [x, y] coordinates of the board
        this.board[move[0]][move[1]] = ' ';
    },
    legalMoves: function() {
        // returns an array of [x, y] that is still open
        var moves = [];
        for(var i=0; i<this.board.length;i++) {
            for(var j=0; j<this.board[i].length;j++){
                // if the slot is not filled yet... 
                if(this.board[i][j]==' '){
                    moves.push([i, j]);
                };
            }
        }
        return moves;
    },
    gameOver: function(lastMove) {
        var x = lastMove[0],
            y = lastMove[1];

        var startPlayer = this.board[x][y];    
        // check if there is a winner: 
        if(this.boardTest.checkRow(startPlayer, x, y, this.board) || this.boardTest.checkCol(startPlayer, x, y, this.board) || this.boardTest.checkDiag(startPlayer, x, y, this.board) ) {
            this.winner = startPlayer;
            return true;
        }
        // check if board empty
        for(var i=0;i<this.board.length;i++) {
            for(var j=0;j<this.board[i].length;j++){
                // there are still empty slots to play
                if(board[i][j]==' '){
                    return false;
                } 
            }
        }

        // otherwise, board is full and there is no winner. 
        this.winner = 'DRAW';
        return true;
    },
    // needs to return move score: 0, 1, -1
    evaluateBoard: function(lastMove) {
        var self = this;
        var x = lastMove[0],
            y = lastMove[1];

        var startPlayer = self.board[x][y];

        // run the board tests and update the scores depending on side..
        if(this.boardTest.checkRow(startPlayer, x, y, self.board) || this.boardTest.checkCol(startPlayer, x, y, self.board) || this.boardTest.checkDiag(startPlayer, x, y, self.board) ) {
            if(self.side=='COMPUTER') {
                self.myBest.score = self.COMPUTER_WIN;
            } else {
                self.reply.score = self.HUMAN_WIN;
            }
        } else {
            if(self.side=='COMPUTER') {
                self.myBest.score = self.DRAW;
            } else {
                self.reply.score = self.DRAW;
            }
        }

    }, // end evaluateBoard() 
    boardTest: {
        checkRow: function(startPlayer, x, y, board) {
            for(var i=0;i<board[x].length;i++) {
                if(board[x][i]!=startPlayer) {
                    return false;
                }
            }
            return true;
        },
        checkCol: function(startPlayer, x, y, board) {
            for(var i=0;i<board.length;i++) {
                if(board[i][y]!=startPlayer) {
                    return false;
                }
            }
            return true;
        },
        checkDiag: function(startPlayer, x, y, board) {
            if(board[0][0] != ' ') {
                if(board[0][0]== startPlayer && board[1][1] == startPlayer && board[2][2] == startPlayer) {
                    return true;
                }
            } else if (board[0][2] != ' ') {
                if(board[0][2] == startPlayer && board[1][1] == startPlayer && board[2][0] == startPlayer) {
                    return true;
                }
            } else {
                return false;
            }
        }
    } // end boardTest object
} // end $scope.miniMax object


}]);