function GameReferee() {
}

GameReferee.prototype.setupNewGameOn = function (board) {
    this.putRandomTileOn(board);
    this.putRandomTileOn(board);
};

GameReferee.prototype.putRandomTileOn = function (board) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(value);
    var cell = this._randomAvailableCellOn(board);

    board.putTileIntoCell(tile, cell);
};

GameReferee.prototype._randomAvailableCellOn = function (board) {
    var availableCells = this._availableCellsOn(board);

    return availableCells[Math.floor(Math.random() * availableCells.length)];
};

GameReferee.prototype._availableCellsOn = function (board) {
    var result = [];

    board.forEachCell(function (cell) {
        if (!board.occupied(cell)) {
            result.push(cell);
        }
    });

    return result;
};

GameReferee.prototype.saysGameIsOver = function (board) {
    return !this._availableCellExistsOn(board) && !this._tileMergesArePossibleOn(board);
};

GameReferee.prototype._availableCellExistsOn = function (board) {
    return this._availableCellsOn(board).length !== 0;
};

GameReferee.prototype._tileMergesArePossibleOn = function (board) {
    for (var x = 0; x < board.size; x++) {
        for (var y = 0; y < board.size; y++) {

            var cell = {
                x: x,
                y: y
            };
            var cellAhead = {
                x: x + 1,
                y: y
            };
            var cellBelow = {
                x: x,
                y: y + 1
            };

            var tile;
            if (this._cellFitsWithinBoardBounds(cellAhead, board)) {
                tile = board.tileIn(cell);
                var tileAhead = board.tileIn(cellAhead);

                if (tile.sameAs(tileAhead)) {
                    return true;
                }
            }
            if (this._cellFitsWithinBoardBounds(cellBelow, board)) {
                tile = board.tileIn(cell);
                var tileBelow = board.tileIn(cellBelow);

                if (tile.sameAs(tileBelow)) {
                    return true;
                }
            }
        }
    }

    return false;
};

GameReferee.prototype._cellFitsWithinBoardBounds = function (cell, board) {
    return cell.x >= 0 && cell.x < board.size && cell.y >= 0 && cell.y < board.size;
};

GameReferee.prototype.makeMoveOnBoard = function (move, board) {
    var shiftDirection = this._getDirectionVectorBasedOn(move);
    var cellSequence = this._buildOrderedCellSequenceBasedOn(shiftDirection, board.size);

    var boardStateChanged = this._tryToChangeBoardStateAccordingTo(cellSequence, shiftDirection, board);

    // if (!boardStateChanged) {
    //     throw {
    //         type: "Illegal Move Exception"
    //     };
    // }
};

GameReferee.prototype._getDirectionVectorBasedOn = function (action) {
    var map = {
        "up": {x: 0, y: 1},
        "right": {x: 1, y: 0},
        "down": {x: 0, y: -1},
        "left": {x: -1, y: 0}
    };

    return map[action];
};

GameReferee.prototype._buildOrderedCellSequenceBasedOn = function (shiftDirection, boardSize) {
    var rows = this._generateListOfNumberInRange(0, boardSize - 1);
    var columns = this._generateListOfNumberInRange(0, boardSize - 1);

    if (shiftDirection.x === 1) {
        columns = columns.reverse();
    }
    if (shiftDirection.y === -1) {
        rows = rows.reverse();
    }

    var result = [];
    rows.forEach(function (x) {
        columns.forEach(function (y) {
            result.push({
                x: x,
                y: y
            });
        });
    });
    return result;
};

GameReferee.prototype._generateListOfNumberInRange = function (min, max) {
    var result = [];

    for (var number = min; number <= max; ++number) {
        result.push(number);
    }

    return result;
};

GameReferee.prototype._tryToChangeBoardStateAccordingTo = function (cellSequence, shiftDirection, board) {
    var self = this;

    var managedToChangeBoardState = false;

    cellSequence.forEach(function (cell) {

        if (board.occupied(cell)) {
            var trajectory = self._planTrajectoryFor(cell, shiftDirection, board);

            var tilesMerged = false;
            if (trajectory.tileToCrashWithExists) {
                var tile = board.tileIn(cell);
                var tileToCrashWith = board.tileIn(trajectory.occupiedCell);

                if (self._shouldMergeTiles(tile, tileToCrashWith)) {
                    self._mergeTilesOnBoard(tile, tileToCrashWith, board);

                    tilesMerged = true;
                    managedToChangeBoardState = true;
                }
            }
            if (!tilesMerged && trajectory.thereIsEnoughRoomToMove) {
                self._moveTileFromTo(cell, trajectory.farthestAvailableCell, board);

                managedToChangeBoardState = true;
            }
        }
    });

    return managedToChangeBoardState;
};

GameReferee.prototype._planTrajectoryFor = function (cell, shiftDirection, board) {
    var tileToCrashWithExists = false;
    var thereIsEnoughRoomToMove = false;

    var nextCell = this._nextCell(cell, shiftDirection);

    if (this._cellFitsWithinBoardBounds(nextCell, board)) {
        if (!board.occupied(nextCell)) {
            thereIsEnoughRoomToMove = true;
        } else {
            tileToCrashWithExists = true;
        }
    }

    while (this._cellFitsWithinBoardBounds(nextCell, board)) {
        if (board.occupied(nextCell)) {
            tileToCrashWithExists = true;
            break;
        }
        cell = nextCell;
        nextCell = this._nextCell(cell, shiftDirection);
    }

    return {
        tileToCrashWithExists: tileToCrashWithExists,
        occupiedCell: nextCell,
        thereIsEnoughRoomToMove: thereIsEnoughRoomToMove,
        farthestAvailableCell: cell
    };
};

GameReferee.prototype._nextCell = function (cell, shiftDirection) {
    return {
        x: cell.x + shiftDirection.x,
        y: cell.y + shiftDirection.y
    };
};

GameReferee.prototype._shouldMergeTiles = function (tile, tileToCrashWith) {
    return !tileToCrashWith.wasMerged() && tileToCrashWith.value === tile.value;
};

GameReferee.prototype._mergeTilesOnBoard = function (tile, tileToMergeWith, board) {
    tileToMergeWith.mergeWith(tile);
    board.removeTileFromCell(cell);
};

GameReferee.prototype._moveTileFromTo = function (cellFrom, cellTo, board) {
    var tile = board.tileIn(cellFrom);
    board.removeTileFromCell(cellFrom);
    board.putTileIntoCell(tile, cellTo);
};
