import BattleShip from "./battleship";

class Gameboard {
  constructor() {
    this.board = this.constructBoard();
    this.missedAttacks = [[0, 1]];
    this.successfulAttacks = [];
  }

  receiveAttack(row, column) {
    const isAlreadyMissed = this.missedAttacks.some(
      (coords) => coords[0] === row && coords[1] === column
    );

    const isAlreadyHit = this.successfulAttacks.some(
      (coords) => coords[0] === row && coords[1] === column
    );

    console.log(`attacking position ${row}, ${column}`);

    if (isAlreadyMissed || isAlreadyHit) {
      console.log("You have already targeted this position, try again");
    } else {
      const attackCoords = this.board[row][column];
      if (attackCoords instanceof BattleShip) {
        attackCoords.hit();
        attackCoords.sunk
          ? console.log("Ship Sinking")
          : console.log("Successful hit");

        this.successfulAttacks.push([row, column]);
      } else {
        console.log("you missed");
        this.missedAttacks.push([row, column]);
      }
    }
  }

  constructBoard() {
    const board = [];
    for (let row = 0; row < 10; row++) {
      board.push([]);
      for (let col = 0; col < 10; col++) {
        board[row].push("~");
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
      for (let i = 0; i < shipLength; i++) {
        gridsArray.push([row + i, column]);
      }
      console.log("gridsArray:", gridsArray);
      // check if proposed position is currently occupied by an existing ship
      const isOccupied = gridsArray.some(
        (position) => this.board[position[0]][position[1]] instanceof BattleShip
      );
      if (isOccupied) {
        console.log("vertical occupied");
        return;
      } else {
        // place ship at specified coordinates
        for (let i = 0; i < shipLength; i++) {
          this.board[row + i][column] = Ship; // vertical
        }
      }
      // horizontal clause
    } else {
      for (let i = 0; i < shipLength; i++) {
        gridsArray.push([row, column + i]);
      }
      // check if proposed position is currently occupied by an existing ship
      const isOccupied = gridsArray.some(
        (position) => this.board[position[0]][position[1]] instanceof BattleShip
      );
      if (isOccupied) {
        console.log("horizontal occupied");
      } else {
        // place ship at specified coordinates
        for (let i = 0; i < shipLength; i++) {
          this.board[row][column + i] = Ship;
        }
      }
    }

    // this.board[row][column] = Ship;
    console.log(this.board);
  }
}

export { Gameboard };
