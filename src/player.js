import Gameboard from './gameboard';

class Player {
  #board;

  #playerName;

  constructor(name) {
    this.#board = new Gameboard();
    this.#playerName = name;
  }

  get board() {
    return this.#board;
  }

  get name() {
    return this.#playerName;
  }

  set name(name) {
    this.#playerName = name;
  }
}

export default Player;
