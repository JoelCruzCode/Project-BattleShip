import BattleShip from '../battleship';

describe('BattleShip', () => {
  let Ship; // Declare Ship outside to be accessible in all tests

  beforeEach(() => {
    Ship = new BattleShip(3, true); // Initialize Ship before each test
  });

  test('returns ship length to be 3', () => {
    expect(Ship.size).toBe(3);
  });

  describe('sink method', () => {
    test('should set #sunk to true after the number of calls to hit meets or exceeds the ships length', () => {
      // Call sink() one less than size times
      for (let i = 0; i < Ship.size - 1; i += 1) {
        Ship.hit();
        expect(Ship.sunk).toBeFalsy();
      }
      expect(Ship.hitCount).toEqual(2);

      // After calling hit() size times, #sunk should be true
      Ship.hit();
      expect(Ship.sunk).toBeTruthy();
    });
  });
});
