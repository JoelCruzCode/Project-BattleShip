import GameBoard from '../gameboard';
import BattleShip from '../battleship';

describe('GameBoard', () => {
  let Game;

  beforeAll(() => {
    Game = new GameBoard(4, 5);
  });
  test('initializes correctly', () => {
    expect(Game).toBeDefined();
  });

  describe('Place ship method', () => {
    beforeAll(() => {
      Game.placeShip([4, 5], 2, true);
    });

    test('Places ship in correct position on board', () => {
      expect(Game.board[4][5]).toBeInstanceOf(BattleShip);
    });

    test('Ship was placed vertically', () => {
      // Game.placeShip([4, 5], 2, true);
      expect(Game.board[5][5]).toBeInstanceOf(BattleShip);
    });

    test('Ship was placed Horizontally', () => {
      Game.placeShip([1, 1], 2, false);

      expect(Game.board[1][1]).toBeInstanceOf(BattleShip);
      expect(Game.board[1][2]).toBeInstanceOf(BattleShip);
    });

    test('should return "Position Occupied" if position on board already has an existing ship', () => {
      const occupiedPosition = Game.placeShip([1, 1], 2, false);
      expect(occupiedPosition).toEqual('Position Occupied');
    });

    describe('receiveAttack method', () => {
      let missedAttack;
      let successfulAttack;
      let successfulAttack2;

      beforeAll(() => {
        missedAttack = Game.receiveAttack(0, 1);
        successfulAttack = Game.receiveAttack(4, 5);
        successfulAttack2 = Game.receiveAttack(5, 5);
      });

      test('should return indication of a missed attack', () => {
        expect(missedAttack).toEqual('You missed');
      });

      test('should return indication of a successful attack', () => {
        expect(successfulAttack).toEqual('Successful hit');
        expect(successfulAttack2).toEqual('Ship sinking');
      });

      // test existing targeted positions
      test('Should return indication of a previously targeted position', () => {
        const alreadyMissed = Game.receiveAttack(0, 1);
        const alreadyAttacked = Game.receiveAttack(4, 5);

        expect(alreadyAttacked).toEqual(
          'you already targeted this position, try again',
        );
        expect(alreadyMissed).toEqual(
          'you already targeted this position, try again',
        );
      });
    });

    describe('checkFleet method', () => {
      let AllShipsSunk;

      beforeAll(() => {
        AllShipsSunk = Game.checkFleet();
      });

      test('returns true if all ships have been sunk', () => {
        expect(AllShipsSunk).toBeFalsy();
      });

      test('returns true after sinking all ships', () => {
        Game.receiveAttack(1, 1);
        Game.receiveAttack(1, 2);
        AllShipsSunk = Game.checkFleet();
        expect(AllShipsSunk).toBeTruthy();
      });
    });
  });
});
