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

    // --- start private methods 
    var checkRow = function(board, x, y, player) {
        for(var i=0; i<board[x].length; i++) {
            if(board[x][i]!=player) {
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

    // this doesn't actually check correctly!!! 
    var checkDiag = function(board, x, y, player) {
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

    var gameOverCheck = function(x, y, player) {
        // check if there are no more spaces in game
        if($scope.filled==9) {
            $scope.gameOver = true;
            $scope.winner = "None";
        }
        var test1 = checkRow($scope.board, x, y, player);
        var test2 = checkCol($scope.board, x, y, player);
        var test3 = checkDiag($scope.board, x, y, player);

        if(test1 || test2 || test3) {
            $scope.gameOver = true;
        } else {
            $scope.gameOver = false;
        }
    }

    // update the board
    var updateBoard = function(x, y) {
        // update the board 
        $scope.board[x][y] =  $scope.player;
        $scope.filled++;
        var id = String(x) + String(y);
        changeTile(id, $scope.player);
        
        // evaluate the board for winner
        gameOverCheck(x, y, $scope.player);

        if($scope.gameOver) {
            $scope.winner = $scope.winner || $scope.player; // this doesn't account for ties
        }
        
    }

    var updatePlayer = function() {
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

    var resetBoard = function() {
        $scope.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    }

    var changeTile = function(id, player) {
        var $currentTile = $(".tile#" + id + " div");
        $currentTile.addClass("player_" + player);
    }

    // --- end private methods


    $scope.play = function(x, y) {
        // return error if player chooses number not in the index
        if(x<0 || x >$scope.board[0].length) {
            console.log("not a valid position");
        } else if (y < 0 || y > $scope.board.length) {
            console.log("not a valid position");
        } else if ($scope.board[x][y]!=' ') {
            console.log("not a valid position - marked already!");
        } else {
            if(!$scope.gameOver) {
                updatePlayer();
                updateBoard(x, y);
            } else {
                console.log("don't update")
            }    
        }
        
    };


}]);
