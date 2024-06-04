import './styles/style.css';
import './styles/fonts.css';
// import GameController from './game-controller';

// import Player from './player';
import BattleShip from './battleship';
import GameController from './game-controller';
// import GameController from './game-controller';

// function removeListener(type, element, listener) {
//   element.removeEventListener(type, listener);
// }

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
    this.options = document.querySelector('.options');
    this.container1 = document.querySelector('#container-1');
    this.container2 = document.querySelector('#container-2');
    this.containerChildren = this.container1.children;

    this.input = document.querySelector('#player01');
    this.playerTitle = document.querySelector('#player-1-title');
    this.player2Title = document.querySelector('#player-2-title');

    this.form = document.querySelector('.form');
    this.aside = document.querySelector('aside');
    this.axisContainer = document.querySelector('.axis-container');
    this.fleetContainer = document.querySelector('#fleet-container');
    this.shipContainers = document.querySelectorAll('.ship-container');
    this.currentHandler = null;
    this.mouseEnter = null;
    this.mouseLeave = null;
    this.placedShipsUI = [];
    this.shipData = null;
    /// Event Listeners

    // Enter player name
    this.nameBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const playerName = this.submitPlayerName(event);
      if (playerName) {
        const { player1, player2 } = this.initializeGameController(playerName);
        this.player1Name = player1.name;
        this.player2Name = player2.name;
        this.player1Board = player1.board.board;
        this.player2Board = player2.board.board;

        this.createGrid(this.player1Board, this.container1);
      }
    });

    // Start game
    this.startBtn.addEventListener('click', this.startUserInterface);

    // switch ship directions
    this.axisContainer.addEventListener('click', this.invertFleetAxis);

    // Listen for ship placements
    this.fleetContainer.addEventListener('click', this.selectShip);
    // Reset game
    this.resetBtn.addEventListener('click', this.resetUserInterface);
  }

  initializeGameController(playerName) {
    this.gameController = new GameController(playerName);

    return this.gameController;
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

  createGrid(board, element) {
    const container = element;
    container.dataset.value =
      container.dataset.index === 1 ? this.player1Name : this.player2Name;
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
  }

  startUserInterface = (event) => {
    event.preventDefault();

    // Check that user has placed all ships on board
    if (this.placedShipsUI.length === 4) {
      this.gameController.startGame();
      this.createGrid(this.player2Board, this.container2);

      this.startBtn.classList.add('hidden');
      this.container2.classList.remove('hidden');
      this.player2Title.classList.remove('hidden');
      this.options.classList.add('hidden');

      this.container1.removeEventListener('click', this.currentHandler);
      this.container1.removeEventListener('mouseenter', this.mouseEnter, true);
      this.container1.removeEventListener('mouseleave', this.mouseLeave, true);

      this.mouseEnter = this.hoverHandler.bind(this, true);
      this.mouseLeave = this.hoverHandler.bind(this, false);

      // Add the new event listeners
      this.shipData.size = 1;
      this.container2.addEventListener('click', this.AttackCoordinator);
      this.container2.addEventListener('mouseenter', this.mouseEnter, true);
      this.container2.addEventListener('mouseleave', this.mouseLeave, true);
    }
  };

  resetUserInterface = (event) => {
    event.preventDefault();
    this.startBtn.classList.toggle('hidden');
    this.container2.classList.toggle('hidden');
    this.player2Title.classList.toggle('hidden');
    this.description.textContent = '';
    this.resetBtn.classList.toggle('hidden');
    this.gameController.resetGame();
    this.player1Board = this.gameController.player1.board.board;
    this.player2Board = this.gameController.cpu.board.board;
    this.container1.innerHTML = ``;
    this.container2.innerHTML = ``;
    this.placedShipsUI = [];
    this.createGrid(this.player1Board, this.container1);
    this.axisContainer.addEventListener('click', this.invertFleetAxis);
  };

  gameOverUserInterface(attacker) {
    this.description.textContent = `Game over, ${attacker.name} wins!`;
    this.options.classList.remove('hidden');
    this.resetBtn.classList.remove('hidden');
    this.container1.removeEventListener('click', this.AttackCoordinator);
    this.container2.removeEventListener('click', this.fleetContainer);
    this.container2.removeEventListener('mouseenter', this.mouseEnter, true);
    this.container2.removeEventListener('mouseleave', this.mouseLeave, true);
    this.axisContainer.removeEventListener('click', this.invertFleetAxis);
    this.shipData = null;
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

  hoverHandler = (isEntering, e) => {
    const { size, axis } = this.shipData;
    if (e.target.classList.contains('grid')) {
      let index = e.target.dataset.value;
      const containerChildren =
        e.target.parentNode.dataset.index === '1'
          ? this.container1.children
          : this.container2.children;
      const [row, column] = JSON.parse(index);
      for (let i = 0; i < size; i += 1) {
        let r = row;
        let c = column;
        if (axis === 'vertical') {
          r = row + i;
        } else {
          c = column + i;
        }
        index = `${r}${c}` < 10 ? c : `${r}${c}`;
        if (containerChildren[index])
          if (isEntering) {
            containerChildren[index].classList.add('highlight');
          } else {
            containerChildren[index].classList.remove('highlight');
          }
      }
    }
  };

  selectShip = (event) => {
    if (event.target.classList.contains('cell')) {
      const { size, axis } = event.target.parentNode.dataset;
      console.log(size, axis);
      this.shipData = { size, axis, coords: [] };

      // Remove the previous event listeners if they exists
      if (this.currentHandler) {
        console.log('Removing previous handlers');

        this.container1.removeEventListener('click', this.currentHandler);
        this.container1.removeEventListener(
          'mouseenter',
          this.mouseEnter,
          true,
        );
        this.container1.removeEventListener(
          'mouseleave',
          this.mouseLeave,
          true,
        );
      }

      // Create a new handler with the current size and axis
      this.currentHandler = this.clickHandler.bind(this, this.shipData);
      this.mouseEnter = this.hoverHandler.bind(this, true);
      this.mouseLeave = this.hoverHandler.bind(this, false);
      // Add the new event listeners
      this.container1.addEventListener('click', this.currentHandler);
      this.container1.addEventListener('mouseenter', this.mouseEnter, true);
      this.container1.addEventListener('mouseleave', this.mouseLeave, true);
    }
  };

  // FIXME stop placedShips from being deleted. also update coords instead of pushing new coords

  // Define the event listener function
  clickHandler = (shipData, e) => {
    const containerChildren = this.container1.children;
    console.log('Data', shipData);
    let positionAvailable = true;
    let inBound = true;
    console.log('target', e.target);

    if (e.target.classList.contains('grid')) {
      this.placedShipsUI.forEach((ship, index) => {
        // if current ship exists remove from ui

        // TODO might add another check to verify that e.targets entire index is within bound to validate remove of preexisting sized ship
        if (ship.size === shipData.size) {
          console.log(' Found same size ship, removing previous ship..');
          ship.coords.forEach((coord) => {
            containerChildren[coord].classList.remove('ship');
          });
          // Remove previous ship object from array to reflect ui
          this.placedShipsUI.splice(index, 1);
          // prepare current ship object for insertion to ui
          shipData.coords.splice(0, shipData.size);
        }
      });
      let index = e.target.dataset.value;
      const [row, column] = JSON.parse(index);
      for (let i = 0; i < shipData.size; i += 1) {
        let r = row;
        let c = column;
        if (shipData.axis === 'vertical') {
          r = row + i;
        } else {
          c = column + i;
        }
        index = `${r}${c}` < 10 ? c : `${r}${c}`;
        // make sure index is not out of bounds

        shipData.coords.push(index);
      }
      // check for ship collision
      this.placedShipsUI.forEach((ship) => {
        ship.coords.forEach((coord) => {
          if (shipData.coords.includes(coord)) {
            positionAvailable = false;
          }
        });
      });
      shipData.coords.forEach((coord) => {
        if (containerChildren[coord] === undefined) inBound = false;
      });

      if (positionAvailable && inBound) {
        shipData.coords.forEach((coord) =>
          containerChildren[coord].classList.add('ship'),
        );
        this.placedShipsUI.push(shipData);
        console.log('placedShipsUI:', this.placedShipsUI);
        return;
      }
      shipData.coords.splice(0, shipData.size);
    }
  };

  invertFleetAxis = (event) => {
    if (event.target instanceof HTMLButtonElement) {
      // changes css properties based on which button is pressed
      const isClickingHorizontal = event.target.textContent === 'Horizontal';
      this.fleetContainer.style.flexDirection = isClickingHorizontal
        ? 'column'
        : 'row';
      this.shipContainers.forEach((container) => {
        const data = container;
        data.dataset.axis = isClickingHorizontal ? 'horizontal' : 'vertical';
        data.style.justifyContent = isClickingHorizontal ? 'start' : 'end';
        data.style.flexDirection = isClickingHorizontal ? 'row' : 'column';
      });

      if (this.currentHandler) {
        this.container1.removeEventListener('click', this.currentHandler);
        this.container1.removeEventListener(
          'mouseenter',
          this.mouseEnter,
          true,
        );
        this.container1.removeEventListener(
          'mouseleave',
          this.mouseLeave,
          true,
        );
      }
      if (this.shipData) {
        this.shipData.axis = event.target.textContent.toLowerCase();

        // Create new handlers with the current size and axis
        this.currentHandler = this.clickHandler.bind(this, this.shipData);
        this.mouseEnter = this.hoverHandler.bind(this, true);
        this.mouseLeave = this.hoverHandler.bind(this, false);
        // Add the new event listeners
        this.container1.addEventListener('click', this.currentHandler);
        this.container1.addEventListener('mouseenter', this.mouseEnter, true);
        this.container1.addEventListener('mouseleave', this.mouseLeave, true);
      }
    }
  };
}
export default UserInterface;
