function Board(size) {
    this.size = size;
    
    this._cells = this._createEmptyCells();
}

Board.prototype._createEmptyCells = function () {
    var result = [];

    for (var x = 0; x < this.size; x++) {
        var row = [];
        for (var y = 0; y < this.size; y++) {
            row.push(null);
        }
        result.push(row);
    }

    return result;
};

Board.prototype.occupied = function (cell) {
    return this._cells[cell.x][cell.y] !== null;
};

Board.prototype.putTileIntoCell = function (tile, cell) {
    this._cells[cell.x][cell.y] = tile;
};

Board.prototype.tileIn = function (cell) {
    return this._cells[cell.x][cell.y];
};

Board.prototype.removeTileFromCell = function (tile, cell) {
    this._cells[cell.x][cell.y] = null;
};

Board.prototype.forEachCell = function (callback) {
    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            var cell = {
                x: x,
                y: y
            };
            callback(cell);
        }
    }
};
