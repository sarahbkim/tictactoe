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
        board: [],
        side: 'COMPUTER',
        chooseMove : function(side) {
            // check if game over
            if($scope.gameOver) {
                return myBest;
            }

            if(side=='COMPUTER') {
                myBest.score = -2;
            } else {
                myBest.score = 2;
            }

            var moves = legalMoves(board);

            for(var i=0;i<moves.length;i++) {
                performMove(moves[i]);
                reply = chooseMove(!side);
                undoMove(moves[i]);
                if(((side=='COMPUTER') && (reply.score > myBest.score)) || ((side=='HUMAN') && (reply.score < myBest.score))) {
                    myBest.move = m;
                    myBest.score = reply.score;
                }
            }
            // return best move and score
            return myBest; 
        },
        performMove: function(move)
            // runs a move that modifies 'this' grid
            // and updates the score for myBest or reply variables.... 
            // @param: move, an array of length 2 [x, y] coordinates of the board
            // evaluates the board 
            this.board[move[0]][move[1]] = side;
            evaluateBoard(this.board, move);
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
        // needs to return move score: 0, 1, -1
        evaluateBoard: function(lastMove) {
            var self = this;
            var x = lastMove[0],
                y = lastMove[1];

            var startPlayer = self.board[x][y];

            // start boardTest inner obj
            var boardTest = {
                checkRow: function() {
                    for(var i=0;i<self.board[this.x].length;i++) {
                        if(board[this.x][i]!=this.startPlayer) {
                            return false;
                        }
                    }
                    return true;
                },
                checkCol: function() {
                    for(var i=0;i<self.board.length;i++) {
                        if(board[i][this.y]!=startPlayer) {
                            return false;
                        }
                    }
                    return true;
                },
                checkDiag: function() {
                    if(self.board[0][0] != ' ') {
                        if(self.board[0][0]== this.startPlayer && self.board[1][1] == this.startPlayer && self.board[2][2] == this.startPlayer) {
                            return true;
                        }
                    } else if (self.board[0][2] != ' ') {
                        if(self.board[0][2] == this.startPlayer && self.board[1][1] == this.startPlayer && self.board[2][0] == this.startPlayer) {
                            return true;
                        }
                    } else {
                        return false;
                    }

                }
            };
            // end boardTest inner obj

            // do checks here... 
            // if board is full with no winner, return draw 
                self.myBest.score = 0; // what about 'reply?'
            // return winner if found
                self.myBest.score = 1;
            // otherwise, don't change the best score

            }
        }

    }


}]);












