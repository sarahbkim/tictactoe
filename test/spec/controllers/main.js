'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('tictactoeApp'));

  var MainCtrl,
    scope;
  var emptyBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });

  }));

  it('should start with an empty board', function() {
    
    expect(scope.board).toEqual(emptyBoard);
  });

  describe('MainCtrl.updatePlayer', function() {
    
    it('should change the player', function() {
      expect(scope.player).toEqual('');
      scope.updatePlayer();
      expect(scope.player).toEqual('x');
      scope.updatePlayer();
      expect(scope.player).toEqual('o');
    });

  })

  describe('MainCtrl.play', function() {

    it('should update the board and filled variables', function() {
      scope.updatePlayer();
      scope.play(0, 0);
      expect(scope.board).toEqual([['o', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']]);
      expect(scope.filled).toEqual(1);
    });

    it('should not update the board if filled', function() {
      scope.play(0, 0);
      scope.play(0, 1);
      scope.play(0, 2);
      scope.play(1, 0);
      scope.play(1, 1);
      scope.play(1, 2);
      scope.play(2, 0);
      scope.play(2, 1);
      scope.play(2, 2);
      
      expect(function() {
        scope.play(2, 2);
      }).toThrow(new Error('dont update'));

    });

    it('should error if you try to input to incorrect tile', function() {
      scope.resetBoard();
      expect(function() {
        scope.play(0, 3);
      }).toThrowError('not a valid position');

      expect(function() {
        scope.play(-3, 4);
      }).toThrowError('not a valid position');

    });

  })

  describe('MainCtrl.resetBoard', function() {
    it('should reset the board to empty when called', function() {
      scope.play(0, 2);
      scope.resetBoard();
      expect(scope.board).toEqual(emptyBoard);
    });
  });

  describe('MainCtrl.checkRow', function() {
    beforeEach(function() {
      scope.play(0, 1);
      scope.play(2, 2);
      scope.play(0, 2);
      scope.play(2, 1);
      
    });

    it('should return true when row has winner', function() {
      scope.play(0, 0);
      expect(scope.checkRow(scope.board, 0, 0, 'x')).toEqual(true);
    });

    it('should return false when row is not yet filled', function() {
      expect(scope.checkRow(scope.board, 2, 1, 'o')).toEqual(false);
    });

    it('should return false when row has no winner', function() {
      scope.play(1, 1);
      scope.play(0, 0);
      expect(scope.checkRow(scope.board, 2, 1, 'o')).toEqual(false);
    });
  });

  describe('MainCtrl.checkCol', function() {
    beforeEach(function() {
      scope.play(0, 0);
      scope.play(0, 1);
      scope.play(1, 0);
      scope.play(2, 2);
    });

    it('should return false if col is not yet filled', function() {
      expect(scope.checkCol(scope.board, 2, 2, scope.player)).toEqual(false);
    });

    it('should return true when col has a winner', function() {
      scope.play(2, 0);
      expect(scope.checkCol(scope.board, 2, 0, scope.player)).toEqual(true);
    });

  });

  describe('MainCtrl.checkDiag', function() {
    beforeEach(function() {
      scope.play(0, 0);
      scope.play(0, 2);
      scope.play(1, 1);
      scope.play(1, 2);
    });

    it('should return true when diag has a winner', function() {
      scope.play(2, 2);
      expect(scope.checkDiag(scope.board, 2, 2, scope.player)).toEqual(true);
    });

  });

});
