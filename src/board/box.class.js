class Node {
  constructor(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }
}

class IBox extends Node {
  constructor(id, size, coord) {
    super(id);

    this._size = size;
    this._coord = coord;
  }

  get coord() {
    return this._coord;
  }

  play() {
    throw new Error(
      "IBox:play: not implemented, you're trying to use an Interface!!"
    );
  }
}

class NormalBox extends IBox {
  constructor(id, size, coord, theme) {
    super(id, size, coord);
    this._theme = theme;
  }

  get theme() {
    return this._theme;
  }

  play() {
    return true;
  }
}

class CheeseBox extends IBox {
  constructor(id, size, coord, theme) {
    super(id, size, coord);
    this._theme = theme;
  }

  get theme() {
    return this._theme;
  }

  play() {}
}

class CenterBox extends IBox {
  constructor(id, size, coord) {
    super(id, size, coord);
  }
  play() {}
}

class ReplayBox extends IBox {
  constructor(id, size, coord) {
    super(id, size, coord);
  }
  play() {}
}
module.exports = { NormalBox, CheeseBox, CenterBox, ReplayBox };
