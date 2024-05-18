import BattleShip from './battleship';

class Gameboard {
  constructor() {
    this.board = Gameboard.constructBoard();
    this.missedAttacks = [[0, 1]];
    this.successfulAttacks = [];
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
      // console.log('You have already targeted this position, try again');
    }
    const attackCoords = this.board[row][column];
    if (attackCoords instanceof BattleShip) {
      attackCoords.hit();
      this.successfulAttacks.push([row, column]);
      return attackCoords.sunk ? 'Ship sinking' : 'Successful hit';
    }
    // console.log('you missed');
    this.missedAttacks.push([row, column]);
    return 'you missed';
  }

  static constructBoard() {
    const board = [];
    for (let row = 0; row < 10; row) {
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
      // console.log('gridsArray:', gridsArray);
      // check if proposed position is currently occupied by an existing ship
      const isOccupied = gridsArray.some(
        (position) =>
          this.board[position[0]][position[1]] instanceof BattleShip,
      );
      if (isOccupied) {
        // console.log('vertical occupied');
        return;
      }
      // place ship at specified coordinates
      for (let i = 0; i < shipLength; i += 1) {
        this.board[row + i][column] = Ship; // vertical
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
        // console.log('horizontal occupied');
      } else {
        // place ship at specified coordinates
        for (let i = 0; i < shipLength; i += 1) {
          this.board[row][column + i] = Ship;
        }
      }
    }

    // this.board[row][column] = Ship;
    // console.log(this.board);
  }
}

export default Gameboard;
