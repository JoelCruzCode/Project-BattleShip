class BattleShip {
  constructor(length) {
    this.length = length;
    this.hit = 0;
    this.sunk = false;
  }

  hit() {
    this.hit++;
  }

  sunk() {
    if (this.hit >= this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
