function Tile(value) {
    this.value = value;
}

Tile.prototype.mergeWith = function (anotherTile) {
    this.value += anotherTile.value;
};

Tile.prototype.sameAs = function (anotherTile) {
    return this.value === anotherTile.value;
};
