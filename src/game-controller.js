import Player from './player';

class GameController {
  constructor(name) {
    this.player = new Player(name);
    this.player2 = new Player('CPU');
  }

  get player1() {
    return this.player;
  }

  //   set player(player) {
  //     this.player = player;
  //   }

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
  //   resetGame() {}

  //
}

export default GameController;
