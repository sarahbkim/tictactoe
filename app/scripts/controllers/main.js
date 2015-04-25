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
        // return error if player chooses number not in the index
        if( x< 0 || x > $scope.board[0].length-1) {
            throw new Error('not a valid position');
        } else if (y < 0 || y > $scope.board.length-1) {
            throw new Error('not a valid position');
        } else if ( $scope.board[x][y]!=' ') {
            throw new Error('not a valid position - marked already!');
        } else {
            if(!$scope.gameOver) {
                $scope.updatePlayer();
                $scope.updateBoard(x, y);
            } else {
                throw new Error('dont update');
            }    
        }
        
    };


}]);
