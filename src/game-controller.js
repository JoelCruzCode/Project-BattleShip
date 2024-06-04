import Player from './player';

class GameController {
  constructor(name) {
    this.player = new Player(name);
    this.player2 = new Player('CPU');
  }

  get player1() {
    return this.player;
  }

  get cpu() {
    return this.player2;
  }

  attack(name, row, column) {
    const player = name === this.player.name ? this.player : this.player2;
    const attacker = player === this.player ? this.player2 : this.player;
    const attack = player.board.receiveAttack(row, column);
    const fleetSunk = player.board.checkFleet();
    const ship = player.board.board[row][column];
    const results = { attack, attacker, fleetSunk, ship };

    return results;
  }

  startGame() {
    const ships = this.player1.board.placedShips;
    ships.forEach((ship) => {
      const [row, col] = ship.coords[0];
      this.player1.board.placeShip([Number(row), col], ship.size, ship.axis);
    });

    // CPU only for current implementation
    this.player2.board.autoPlace();
  }

  resetGame() {
    this.player1.board.resetBoard();
    this.player2.board.resetBoard();
  }
}

export default GameController;
