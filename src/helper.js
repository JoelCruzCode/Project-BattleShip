// unused functions
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

const checkNeighbors = (coords, size, vertical) => {
  const [row, col] = coords;
  const possibleAttacks = [];
  for (let i = 1; i <= size; i += 1) {
    let next;
    let prev;
    if (vertical) {
      next = [row + i, col];
      prev = [row - i, col];
    } else {
      next = [row, col + i];
      prev = [row, col - i];
    }
    possibleAttacks.push(next);
    possibleAttacks.push(prev);
  }

  console.log('possible Attacks: ', possibleAttacks);
  return possibleAttacks;
};

const rand = (size = 10) => Math.floor(Math.random() * size);

const randomCoords = (size = 10) => [rand(size), rand(size)];
export { randomCoords, checkNeighbors };
