function Tile(value) {
    this.value = value;
    
    this._wasMerged = false;
}

Tile.prototype.mergeWith = function (anotherTile) {
    this.value += anotherTile.value;
    this._wasMerged = true;
};

Tile.prototype.wasMerged = function () {
    if (this._wasMerged) {
        this._wasMerged = false;
        return true;
    } else {
        return false;
    }
};

Tile.prototype.sameAs = function (anotherTile) {
    return this.value === anotherTile.value;
};
