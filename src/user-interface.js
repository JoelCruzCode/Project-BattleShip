import './styles/style.css';
import './styles/fonts.css';
// import GameController from './game-controller';

// import Player from './player';
import BattleShip from './battleship';
import GameController from './game-controller';
// import GameController from './game-controller';

class UserInterface {
  constructor() {
    this.init();
  }

  init() {
    // selectors
    this.nameBtn = document.querySelector('#player01-name-submit');
    this.startBtn = document.querySelector('#start-btn');
    this.resetBtn = document.querySelector('#reset-btn');
    this.description = document.querySelector('.description');
    this.options = document.querySelector('#options');
    this.container1 = document.querySelector('#container-1');
    this.container2 = document.querySelector('#container-2');

    this.input = document.querySelector('#player01');
    this.playerTitle = document.querySelector('#player-1-title');
    this.form = document.querySelector('.form');
    this.aside = document.querySelector('aside');

    /// Event Listeners

    // Enter player name
    this.nameBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const playerName = this.submitPlayerName(event);
      if (playerName) {
        const { player1Name, player2Name, playerBoards } =
          this.initializeGameController(playerName);

        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.createGrids(playerBoards);
      }
    });

    // Start game
    this.startBtn.addEventListener('click', this.startUserInterface);

    // Listen for attacks
    this.container2.addEventListener('click', this.AttackCoordinator);

    // Reset game
    // this.resetBtn.addEventListener('click', this.gameController.resetGame);
  }

  initializeGameController(playerName) {
    this.gameController = new GameController(playerName);
    this.gameController.player1.board.placeShip([0, 9], 3, true);
    this.gameController.player1.board.placeShip([0, 0], 2, true);
    this.gameController.player1.board.placeShip([6, 3], 4, false);
    this.gameController.player1.board.placeShip([4, 5], 5, false);

    this.gameController.cpu.board.placeShip([0, 9], 3, true);
    this.gameController.cpu.board.placeShip([0, 0], 2, true);
    this.gameController.cpu.board.placeShip([6, 3], 4, false);
    this.gameController.cpu.board.placeShip([4, 5], 5, false);

    const player1Name = this.gameController.player1.name;
    const player2Name = this.gameController.player2.name;

    const playerBoards = [
      this.gameController.player1.board.board,
      this.gameController.cpu.board.board,
    ];

    return { player1Name, player2Name, playerBoards };
  }

  submitPlayerName(event) {
    // Check if the input is empty
    event.preventDefault();
    if (!this.input.value.trim()) {
      this.description.classList.remove('hidden');
      this.description.textContent = 'Please enter a valid name';
      return;
    }

    // Proceed with the form submission logic
    this.playerTitle.textContent = this.input.value;
    this.container1.classList.remove('hidden');
    this.playerTitle.classList.remove('hidden');
    this.form.classList.add('hidden');
    this.aside.classList.remove('hidden');
    this.description.textContent = '';
    return this.input.value; // eslint-disable-line
  }

  createGrids(boards) {
    boards.forEach((board, index) => {
      const container = index === 0 ? this.container1 : this.container2;
      container.dataset.value =
        index === 0 ? this.player1Name : this.player2Name;
      for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board.length; j += 1) {
          const grid = document.createElement('div');
          grid.classList.add('grid');
          // indexing the user interface to reference the players board with event handlers later
          grid.dataset.value = `[${i},${j}]`;
          grid.style.gridTemplateColumns = `repeat(${board.length}, auto)`;
          if (board[i][j] instanceof BattleShip) {
            grid.classList.add('ship');
          }
          container.appendChild(grid);
        }
      }
    });
  }

  startUserInterface = (event) => {
    event.preventDefault();
    this.startBtn.classList.add('hidden');
    this.container2.classList.remove('hidden');
    const player2Title = document.querySelector('#player-2-title');
    player2Title.classList.remove('hidden');
    this.options.classList.add('hidden');
  };

  gameOverUserInterface(attacker) {
    this.description.textContent = `Game over, ${attacker.name} wins!`;
    this.options.classList.remove('hidden');
    this.resetBtn.classList.remove('hidden');
  }

  displayAttackResult(results, event) {
    const { attack, attacker, fleetSunk, ship } = results;
    this.description.textContent = attack;
    if (attack === 'you already targeted this position, try again') {
      console.log('move this clause');
    } else if (attack === 'Successful hit') {
      event.target.classList.add('hit'); // orange
    } else if (attack === 'Ship sinking') {
      // traverse the positions of the sinking ship to update the UI(red)
      ship.positions.forEach((pos) => {
        const [r, c] = pos;
        const container = event.target.parentNode.id;
        const gridEl = document.querySelector(
          `#${container} [data-value="[${r},${c}]"]`,
        );
        gridEl.classList.add('sunk');
      });
    } else {
      event.target.classList.add('miss');
    }
    if (fleetSunk) {
      this.gameOverUserInterface(attacker);
    }
  }

  AttackCoordinator = (event) => {
    if (event.target.classList.contains('grid')) {
      const index = event.target.dataset.value;
      const playerName = event.target.parentNode.dataset.value;
      const [row, column] = JSON.parse(index);
      const results = this.gameController.attack(playerName, row, column);
      this.displayAttackResult(results, event);
    }
  };
}
export default UserInterface;
