import './styles/style.css';
import './styles/fonts.css';

import Player from './player';
import BattleShip from './battleship';

// selectors
const nameBtn = document.querySelector('#player01-name-submit');
const startBtn = document.querySelector('#start-btn');
// create predetermined coordinates of ships
const Player1 = new Player('Joel');
const player1Board = Player1.board.board;
Player1.board.placeShip([0, 9], 3, true);
Player1.board.placeShip([0, 0], 2, true);
Player1.board.placeShip([6, 3], 4, false);
Player1.board.placeShip([4, 5], 5, false);

const Player2 = new Player('Ai');
const player2Board = Player2.board.board;
Player2.board.placeShip([0, 9], 3, true);
Player2.board.placeShip([0, 0], 2, true);
Player2.board.placeShip([6, 3], 4, false);
Player2.board.placeShip([4, 5], 5, false);
// console.log(Player1.board.board); // eslint-disable-line no-console

const container1 = document.querySelector('#container-1');
container1.dataset.value = Player1.name;
const container2 = document.querySelector('#container-2');
container2.dataset.value = Player2.name;

// I will be creating the entire User Interface here.

function createGrids(element, board) {
  //   const [board] = player.board.board;
  console.log(board); // eslint-disable-line no-console
  // create ui representing a players board
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board.length; j += 1) {
      const grid = document.createElement('div');
      grid.classList.add('grid');
      //   grid.classList.add(`cell-${i}${j}`);
      // indexing ui to connect with board on mouse click later
      grid.dataset.value = `[${i},${j}]`;
      grid.style.gridTemplateColumns = `repeat(${board.length}, auto)`;
      if (board[i][j] instanceof BattleShip) {
        grid.classList.add('ship');
      }
      element.appendChild(grid);
    }
  }
}

createGrids(container1, player1Board);
createGrids(container2, player2Board);

function submitPlayerName() {
  const input = document.querySelector('#player01');
  const playerTitle = document.querySelector('#player-1-title');
  const form = document.querySelector('.form');
  const aside = document.querySelector('aside');
  const player = new Player(input.value);
  playerTitle.textContent = input.value;
  container1.classList.remove('hidden');
  playerTitle.classList.remove('hidden');
  form.classList.add('hidden');
  aside.classList.remove('hidden');
  return player;
}
// createGrids(container2, 10);
// I can abstract the game Controller later if needed.

// Create 2 separate game boards using div [x]

// create instances of the ships

// event listeners

// enter player name
nameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  submitPlayerName();
});

// finalize ship positions

// start game
startBtn.addEventListener('click', (e) => {
  e.preventDefault();
  startBtn.classList.add('hidden');
  container2.classList.remove('hidden');
});

container2.addEventListener('click', (e) => {
  console.log(e.target.classList.contains('grid'));
  if (e.target.classList.contains('grid')) {
    const index = e.target.dataset.value;
    console.log(index);
    // how do i find out which player class im clicking on  depending on board
    // call receive attack with index
    // handle interface depending on return of receive attack
    // e.target.classList.add('hit');
  }
});
