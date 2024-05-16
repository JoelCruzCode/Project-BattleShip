class BattleShip {
  #sunk;
  #vertical;
  #size;

  constructor(length, vertical) {
    this.#size = length;
    this.hitCount = 0;
    this.#sunk = false;
    this.#vertical = vertical;
  }

  hit() {
    this.hitCount++;
    this.sink();
  }

  sink() {
    if (this.hitCount >= this.size) {
      this.#sunk = true;
    }
  }

  get sunk() {
    return this.#sunk;
  }

  get vertical() {
    return this.#vertical;
  }

  get size() {
    return this.#size;
  }
}

export default BattleShip;
