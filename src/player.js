import Gameboard from './gameboard';

class Player {
  #board;

  #name;

  constructor(name) {
    this.#board = new Gameboard();
    this.#name = name;
  }

  get board() {
    return this.#board;
  }

  get name() {
    return this.#name;
  }
}

export default Player;
