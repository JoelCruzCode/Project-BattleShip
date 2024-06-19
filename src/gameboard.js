import BattleShip from './battleship';
import { randomCoords } from './helper';

class Gameboard {
  #board;

  #placedShips;

  constructor() {
    this.#board = Gameboard.constructBoard();
    this.missedAttacks = [];
    this.successfulAttacks = [];
    this.#placedShips = [];
  }

  resetBoard() {
    this.#board = Gameboard.constructBoard();
    this.#placedShips = [];
    this.successfulAttacks = [];
    this.missedAttacks = [];
  }

  checkFleet() {
    return this.placedShips.every((ship) => ship.sunk);
  }

  receiveAttack(row, column) {
    console.log('these are the placed ships:', this.placedShips);
    const isAlreadyMissed = this.missedAttacks.some(
      (coords) => coords[0] === row && coords[1] === column,
    );

    const isAlreadyHit = this.successfulAttacks.some(
      (coords) => coords[0] === row && coords[1] === column,
    );

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
    const Ship = new BattleShip(length, vertical);
    const gridsArray = [];
    const shipLength = Ship.size;

    console.log('is vertical?', vertical);
    // adjust cords based on boolean(vertical)
    for (let i = 0; i < shipLength; i += 1) {
      // const formattedStart = start.length < 2 ? `0${start}` : start;
      const [row, column] = this.adjustCoords(start, i, vertical);
      gridsArray.push([row, column]);
    }
    console.log('grids Array: ', gridsArray);
    console.log('this.board:', this.board);

    // check if proposed position is currently occupied by an existing ship
    const isOccupied = gridsArray.some(
      (position) => this.board[position[0]][position[1]] instanceof BattleShip,
    );
    if (isOccupied) {
      return 'Position Occupied';
    }
    // place ship at specified coordinates
    for (let i = 0; i < shipLength; i += 1) {
      // const formattedStart = start.length < 2 ? `0${start}` : start;

      const [row, column] = this.adjustCoords(start, i, vertical);

      this.board[row][column] = Ship;
      Ship.positions.push([row, column]);

      this.#placedShips.push(Ship);
    }
    return 'Ship Placed Successfully';

    // this.board[row][column] = Ship;
  }

  get board() {
    return this.#board;
  }

  get placedShips() {
    return this.#placedShips;
  }

  // eslint-disable-next-line
  adjustCoords(start, i, vertical) {
    // const formattedStart = start.length < 2 ? `0${start}` : start;

    // default - vertical
    let [x, y] = start;

    x = Number(x);
    y = Number(y);
    if (vertical === 'vertical') {
      x += i;
    } else {
      y += i;
    }

    return [x, y];
  }

  checkValid(start, length, vertical) {
    let valid;
    const [row, col] = start;
    console.log('starting position:', row, col);
    console.log('is vertical', vertical);
    for (let i = 0; i < length; i += 1) {
      const [r, c] = this.adjustCoords([row, col], i, vertical);
      console.log(`row: ${r} col: ${c}`);
      if (r < 10 && c < 10) valid = true;
      else {
        console.log('not valid');
        return false;
      }
    }
    return valid;
  }

  autoPlace() {
    const shipSizes = [2, 3, 4, 5];

    shipSizes.forEach((size) => {
      let placed = false;

      while (!placed) {
        const randomAxis = Math.random() > 0.5;
        const randomStart = randomCoords();
        if (this.checkValid(randomStart, size, randomAxis)) {
          const result = this.placeShip(randomStart, size, randomAxis);

          if (result === 'Ship Placed Successfully') {
            placed = true;
          }
        }
      }
    });
  }
}

export default Gameboard;
