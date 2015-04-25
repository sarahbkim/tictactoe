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
      }).toThrow(new Error('not a valid position - marked already!'));

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
});
