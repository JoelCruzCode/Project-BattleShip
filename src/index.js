import './styles/style.css';
import './styles/fonts.css';

import Player from './player';
import BattleShip from './battleship';

// selectors
const nameBtn = document.querySelector('#player01-name-submit');
const startBtn = document.querySelector('#start-btn');
const resetBtn = document.querySelector('#reset-btn');
// create predetermined coordinates of ships
const Player1 = new Player('Joel');
const description = document.querySelector('.description');
const options = document.querySelector('#options');

const player1Board = Player1.board.board; // get board from board class
Player1.board.placeShip([0, 9], 3, true);
Player1.board.placeShip([0, 0], 2, true);
Player1.board.placeShip([6, 3], 4, false);
Player1.board.placeShip([4, 5], 5, false);

const Player2 = new Player('Ai');
const player2Board = Player2.board.board; // get board from board class
console.log(player2Board);
Player2.board.placeShip([0, 9], 3, true);
Player2.board.placeShip([0, 0], 2, true);
Player2.board.placeShip([6, 3], 4, false);
Player2.board.placeShip([4, 5], 5, false);

const container1 = document.querySelector('#container-1');
container1.dataset.value = Player1.name;
const container2 = document.querySelector('#container-2');
container2.dataset.value = Player2.name;

function createGrids(parentElement, board) {
  // create a user interface to represent a players' board
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
      parentElement.appendChild(grid);
    }
  }
}

createGrids(container1, player1Board);
createGrids(container2, player2Board);

function submitPlayerName(event) {
  event.preventDefault();
  const input = document.querySelector('#player01');
  const playerTitle = document.querySelector('#player-1-title');
  const form = document.querySelector('.form');
  const aside = document.querySelector('aside');

  // Check if the input is empty
  if (!input.value.trim()) {
    description.classList.remove('hidden');
    description.textContent = 'Please enter a valid name';
    return;
  }

  // Proceed with the form submission logic
  // const player = new Player(input.value);
  playerTitle.textContent = input.value;
  container1.classList.remove('hidden');
  playerTitle.classList.remove('hidden');
  form.classList.add('hidden');
  aside.classList.remove('hidden');
  description.textContent = '';
}

function startUserInterface(event) {
  event.preventDefault();
  startBtn.classList.add('hidden');
  container2.classList.remove('hidden');
  const player2Title = document.querySelector('#player-2-title');
  player2Title.classList.remove('hidden');
  // const optionsDescription = document.querySelector(
  //   '.options-ships-description',
  // );
  // optionsDescription.classList.add('hidden');
  options.classList.add('hidden');
}

function handleAttackResult(attack, index, event) {
  // const description = document.querySelector('.description');
  description.textContent = attack;
  if (attack === 'you already targeted this position, try again') {
    console.log('move this clause');
  } else if (attack === 'Successful hit') {
    event.target.classList.add('hit'); // orange
  } else if (attack === 'Ship sinking') {
    const [row, column] = index;
    const sinkingShip = player2Board[row][column];
    // traverse the positions of the sinking ship to update the UI(red)
    sinkingShip.positions.forEach((pos) => {
      const [r, c] = pos;
      const container = event.target.parentNode.id;
      console.log(container);
      const gridEl = document.querySelector(
        `#${container} [data-value="[${r},${c}]"]`,
      );
      gridEl.classList.add('sunk');
    });
    // FIXME is me referencing ship making this method tightly coupled ?
  } else {
    event.target.classList.add('miss');
  }
}

function gameOverUserInterface(player) {
  const playerName = player.name;
  // const description = document.querySelector('.description');
  description.textContent = `Game over, ${playerName} wins!`;
  // const resetBtn = document.querySelector('#reset-btn');
  options.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
}

function AttackController(event) {
  if (event.target.classList.contains('grid')) {
    const index = event.target.dataset.value;
    const [row, column] = JSON.parse(index);
    const attack = Player2.board.receiveAttack(row, column);
    handleAttackResult(attack, [row, column], event);
    if (Player2.board.checkFleet()) {
      gameOverUserInterface(Player1);
    }
  }
}

// function startGame() {
//   // this function should create  each players class and respective boards based  the selection of the user interface
// }
function resetGame() {
  // reset the games classes
}
// event listeners

// enter player name
nameBtn.addEventListener('click', submitPlayerName);

// finalize ship positions

// start game
startBtn.addEventListener('click', startUserInterface);

resetBtn.addEventListener('click', resetGame);

container2.addEventListener('click', AttackController);

// Beta will only be playable against the CPU
// TODO create event handler functions

// TODO add dom elements to top of file

// TODO implement CPU logic/moveset reference tic tac?

// TODO how do I switch turns from the cpu and the player?

// TODO create end game UI render, when should i check if the game is over after each turn or each hit?

// TODO abstract the gameController from index.js

// TODO rename functions?
