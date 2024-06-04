// unused functions
// function populateShips(container, board) {
//     container.forEach(row => {
//         row.forEach(col => {
//             if(board[row][col] === true) {

//             }
//         })
//     })
// }

// content.textContent = "Hello Webpack";
// console.log("hello?");
// console.log(content);

// import webpackImg from './assets/images/webpackImg.webp';
// Webpack Image
// const myIcon = new Image();
// myIcon.src = webpackImg;
// content.appendChild(myIcon);

// function component() {
//   const element = document.createElement("div");

//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//   return element;
// }

// const player2 = new Player();
// how can i get my player to change the state of vertical or not
// const carrier = new BattleShip(5, true);
// const battleship = new BattleShip(4, true);
// const destroyer = new BattleShip(3, false);
// const submarine = new BattleShip(3);
// const patrolBoat = new BattleShip(2);

// const content = document.querySelector('#content');
// const title = document.createElement('h1');
// title.textContent = 'BattleShip';
// title.classList.add('greeting');
// document.querySelector('body').prepend(title);

// container1.addEventListener('click', (e) => {
//   if (e.target.classList.contains('grid')) {
//     // const cellClasses = e.target.classList;
//     const index = e.target.dataset.value;
//     console.log(index); // eslint-disable-line no-console
//     // how do i find out which player class im clicking on  depending on board
//     // call receive attack with index
//     // handle interface depending on return of receive attack

//     e.target.classList.add('hit');
//   }
// });

/// refactored this event listener by putting the conditions of container 2 and handleAttack rEsult together
// container2.addEventListener('click', (e) => {
//   if (e.target.classList.contains('grid')) {
//     const index = e.target.dataset.value;
//     const [row, column] = JSON.parse(index);

//     const attack = Player2.board.receiveAttack(row, column);
//     handleAttackResult(attack, [row, column], e);
//     if (Player2.board.checkFleet()) {
//       gameOverUserInterface(Player1);
//     }
//   }
// });

const rand = (size = 10) => Math.floor(Math.random() * size);

const randomCoords = (size = 10) => [rand(size), rand(size)];
export default randomCoords;
