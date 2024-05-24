import BattleShip from './battleship';

class Gameboard {
  #board;

  #placedShips;

  constructor() {
    this.#board = Gameboard.constructBoard();
    this.missedAttacks = [];
    this.successfulAttacks = [];
    this.#placedShips = [];
  }

  checkFleet() {
    return this.placedShips.every((ship) => ship.sunk);
  }

  receiveAttack(row, column) {
    const isAlreadyMissed = this.missedAttacks.some(
      (coords) => coords[0] === row && coords[1] === column,
    );

    const isAlreadyHit = this.successfulAttacks.some(
      (coords) => coords[0] === row && coords[1] === column,
    );

    // console.log(`attacking position ${row}, ${column}`);

    if (isAlreadyMissed || isAlreadyHit) {
      return 'you already targeted this position, try again';
    }
    const attackCoords = this.board[row][column];
    if (attackCoords instanceof BattleShip) {
      attackCoords.hit();
      this.successfulAttacks.push([row, column]);
      return attackCoords.sunk ? 'Ship sinking' : 'Successful hit';
    }
    this.missedAttacks.push([row, column]);
    return 'You missed';
  }

  static constructBoard() {
    const board = [];
    for (let row = 0; row < 10; row += 1) {
      board.push([]);
      for (let col = 0; col < 10; col += 1) {
        board[row].push('~');
      }
    }
    return board;
  }

  placeShip(start, length, vertical) {
    const [row, column] = start;
    const Ship = new BattleShip(length, vertical);
    const gridsArray = [];
    const shipLength = Ship.size;

    if (Ship.vertical) {
      for (let i = 0; i < shipLength; i += 1) {
        gridsArray.push([row + i, column]);
      }
      // check if proposed position is currently occupied by an existing ship
      const isOccupied = gridsArray.some(
        (position) =>
          this.board[position[0]][position[1]] instanceof BattleShip,
      );
      if (isOccupied) {
        return 'Position Occupied';
      }
      // place ship at specified coordinates
      for (let i = 0; i < shipLength; i += 1) {
        this.board[row + i][column] = Ship; // vertical
        Ship.positions.push([row + i, column]);

        this.#placedShips.push(Ship);
      }
      // horizontal clause
    } else {
      for (let i = 0; i < shipLength; i += 1) {
        gridsArray.push([row, column + i]);
      }
      // check if proposed position is currently occupied by an existing ship
      const isOccupied = gridsArray.some(
        (position) =>
          this.board[position[0]][position[1]] instanceof BattleShip,
      );
      if (isOccupied) {
        return 'Position Occupied';
      }
      // place ship at specified coordinates
      for (let i = 0; i < shipLength; i += 1) {
        this.board[row][column + i] = Ship;
        Ship.positions.push([row, column + i]);
        this.#placedShips.push(Ship);
      }
    }

    // console.log(this.board);
    // console.log(this.#placedShips);
    return 'Ship Placed Successfully';

    // this.board[row][column] = Ship;
  }

  get board() {
    return this.#board;
  }

  get placedShips() {
    return this.#placedShips;
  }
}

export default Gameboard;
