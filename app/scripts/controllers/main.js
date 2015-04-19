'use strict';

/**
 * @ngdoc function
 * @name tictactoeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tictactoeApp
 */
angular.module('tictactoeApp')
  .controller('MainCtrl', function ($scope) {
    // on load, generate a 9-tiled board
    $scope.filled = 0;
    $scope.player = '';
    $scope.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];

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
        if($scope.filled==9) {
            console.log("Game over: no more boxes to fill!" + $scope.filled)
            return true;
        }
        var test1 = checkRow($scope.board, x, y, player);
        var test2 = checkCol($scope.board, x, y, player);
        var test3 = checkDiag($scope.board, x, y, player);

        if(test1 || test2 || test3) {
            return true;
        } else {
            return false;
        }
    }

    // update the board
    var update_board = function(x, y) {
        // update the board 
        update_player();
        $scope.board[x][y] =  $scope.player;
        $scope.filled++;
        var id = String(x) + String(y);
        changeTile(id, $scope.player);
        
        // evaluate the board for winner
        if(game_over_check(x, y, $scope.player)) {
            console.log("Winner is: ", $scope.player);
        } else {
            console.log("Make the next move please...");
        }
    }

    var update_player = function() {
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
        var $currentTile = $(".tile#" + id)
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
        } 
        if(game_over_check(x, y, $scope.player)==false) {    
            update_board(x, y);
        }
    }



});
