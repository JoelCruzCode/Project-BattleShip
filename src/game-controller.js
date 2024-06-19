import { checkNeighbors, randomCoords } from './helper';
import Player from './player';

class GameController {
  constructor(name) {
    this.player = new Player(name);
    this.player2 = new Player('CPU');
    this.foundShip = {
      found: false,
      sunk: false,
      vertical: false,
      firstAttack: null,
      previousAttack: null,
      missedAttacks: [],
      missedCounter: 0,
      successfulAttacks: [],
    };
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

  startGame(ships) {
    ships.forEach((ship) => {
      ship.coords.forEach((coord) => {
        // Pad single-digit coordinates with leading zero
        const formattedCoord =
          coord.toString().length === 1 ? `0${coord}` : coord.toString();

        // Convert formatted string to row and column
        const row = Number(formattedCoord[0]);
        const col = Number(formattedCoord[1]);

        console.log('row & col', row, col);

        this.player1.board.placeShip([row, col], ship.size, ship.axis);
      });
    });

    // CPU only for current implementation
    this.player2.board.autoPlace();
  }

  resetGame() {
    this.player1.board.resetBoard();
    this.player2.board.resetBoard();
  }

  attackCoordinator(name, row, column) {
    // player's attack
    const results = this.attack(name, row, column);
    const valid =
      results.attack !== 'you already targeted this position, try again';
    let counterAttack;
    if (!results.fleetSunk && valid) {
      // cpu's attack
      counterAttack = this.cpuAttack();
      results.counterResults = counterAttack;
    }
    return results;
  }

  cpuAttack() {
    const p1Board = this.player.board;
    const { missedAttacks } = p1Board;
    const { successfulAttacks } = p1Board;
    let hasAttacked = false;
    let coords;

    while (!hasAttacked) {
      let valid;
      if (this.foundShip.found) {
        coords = this.cpuTargetShip(p1Board);
        valid = true;
      } else {
        coords = randomCoords();
        valid = this.validateAttack(coords, missedAttacks, successfulAttacks);
      }
      if (valid) {
        hasAttacked = true;
      }
    }
    console.log('coords attack', coords[0], coords[1]);
    const attack = this.attack(this.player.name, coords[0], coords[1]);
    attack.coords = coords;
    console.log('attack.attack :', attack.attack);
    if (attack.attack === 'Successful hit') {
      this.foundShip.successfulAttacks.push(
        successfulAttacks[successfulAttacks.length - 1],
      );
      console.log('successfulShipAttacks: ', this.foundShip.successfulAttacks);
      if (!this.foundShip.found)
        this.foundShip.firstAttack =
          successfulAttacks[successfulAttacks.length - 1];
      this.foundShip.found = true;
    }
    if (attack.attack === 'Ship sinking') {
      this.foundShip.found = false;
      this.foundShip.missedAttacks = [];
      this.foundShip.successfulAttacks = [];
    }
    if (this.foundShip.found) {
      if (attack.attack === 'You missed') {
        this.foundShip.missedAttacks.push(
          missedAttacks[missedAttacks.length - 1],
        );

        console.log('found-missed: ', this.foundShip.missedAttacks);
      }
    }
    return attack;
  }

  cpuTargetShip(enemyBoard) {
    const { missedAttacks } = enemyBoard;
    const { successfulAttacks } = enemyBoard;
    this.foundShip.previousAttack =
      successfulAttacks[successfulAttacks.length - 1];

    console.log('successfulAttacks: ', this.foundShip.successfulAttacks);
    console.log('prevAttack:', this.foundShip.previousAttack);
    console.log('missedAttacks: ', this.foundShip.missedAttacks);
    const [row, col] = this.foundShip.firstAttack;
    const [prevRow, prevCol] = this.foundShip.previousAttack;

    console.log('firstAttack: ', this.foundShip.firstAttack);
    console.log('prevAttack: ', this.foundShip.previousAttack);
    let possibleAttacks;

    // compare first attack vs recent attack to determine direction of next attack
    if (row !== prevRow) this.foundShip.vertical = true;

    if (col !== prevCol) this.foundShip.vertical = false;

    possibleAttacks = checkNeighbors(
      this.foundShip.firstAttack,
      5,
      this.foundShip.vertical,
    );

    // TODO Possible implementations to make computer smarter:
    // 1.) later on after i sink a ship i can check the indices of sunk ship vs successful attacks to filter out any successful attacks
    // and assign that as the first successful attack of the next found ship
    // 2.) check available space around target to make sure space > remaining ships size
    // 3.) Same implementation as #2 for random attack
    // 4.) should starting axis be random for unpredictability?

    let validAttacks = possibleAttacks.filter((coord) =>
      this.validateAttack(coord, missedAttacks, successfulAttacks),
    );

    if (!validAttacks[0]) {
      // switch axis if no possible neighbors
      this.foundShip.vertical = !this.foundShip.vertical;
      possibleAttacks = checkNeighbors(
        this.foundShip.firstAttack,
        5,
        this.foundShip.vertical,
      );
      validAttacks = possibleAttacks.filter((coord) =>
        this.validateAttack(coord, missedAttacks, successfulAttacks),
      );
      return validAttacks[0];
    }
    console.log('valid attacks: ', validAttacks);

    return validAttacks[0];
  }
  // eslint-disable-next-line
  validateAttack(attack, missedArray, hitArray) {
    console.log('validate-attack:', attack);
    const [row, column] = attack;

    if (this.foundShip.found) {
      const neighbors = [];

      this.foundShip.successfulAttacks.forEach((coord) => {
        neighbors.push([coord[0] + 1, coord[1]]);
        neighbors.push([coord[0] - 1, coord[1]]);
        neighbors.push([coord[0], coord[1] + 1]);
        neighbors.push([coord[0], coord[1] - 1]);
      });
      console.log('neighbors: ', neighbors);
      const isNeighbor = neighbors.some(
        (coords) => coords[0] === row && coords[1] === column,
      );

      if (!isNeighbor) return false;
    }

    const isAlreadyMissed = missedArray.some(
      (coords) => coords[0] === row && coords[1] === column,
    );

    const isAlreadyHit = hitArray.some(
      (coords) => coords[0] === row && coords[1] === column,
    );

    if (isAlreadyMissed || isAlreadyHit) return false;

    // validate inbounds
    if (row < 0 || row > 9 || column < 0 || column > 9) return false;

    return true;
  }
}

export default GameController;
