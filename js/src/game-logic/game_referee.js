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

GameReferee.prototype.saysGameIsOverOn = function (board) {
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
    var cellSequences = this._buildOrderedCellSequencesBasedOn(shiftDirection, board.size);

    var boardStateChanged = this._tryToChangeBoardStateAccordingTo(cellSequences, shiftDirection, board);

    if (!boardStateChanged) {
        throw {
            type: "Illegal Move Exception"
        };
    }
};

GameReferee.prototype._getDirectionVectorBasedOn = function (action) {
    var map = {
        "up": {x: -1, y: 0},
        "right": {x: 0, y: 1},
        "down": {x: 1, y: 0},
        "left": {x: 0, y: -1}
    };

    return map[action];
};

GameReferee.prototype._buildOrderedCellSequencesBasedOn = function (shiftDirection, boardSize) {
    var result = [];
    for (var i = 0; i < boardSize; i++) {
        result[i] = [];
    }

    var x;
    var y;

    if (shiftDirection.x === -1) {
        for (x = 0; x < boardSize; x++) {
            for (y = 0; y < boardSize; y++) {
                result[y].push({
                    x: x,
                    y: y
                });
            }
        }
    }
    if (shiftDirection.x === 1) {
        for (x = boardSize - 1; x >= 0; x--) {
            for (y = 0; y < boardSize; y++) {
                result[y].push({
                    x: x,
                    y: y
                });
            }
        }
    }
    if (shiftDirection.y === -1) {
        for (x = 0; x < boardSize; x++) {
            for (y = 0; y < boardSize; y++) {
                result[x].push({
                    x: x,
                    y: y
                });
            }
        }
    }
    if (shiftDirection.y === 1) {
        for (x = 0; x < boardSize; x++) {
            for (y = boardSize - 1; y >= 0; y--) {
                result[x].push({
                    x: x,
                    y: y
                });
            }
        }
    }

    return result;
};

GameReferee.prototype._tryToChangeBoardStateAccordingTo = function (cellSequences, shiftDirection, board) {
    var self = this;

    var managedToChangeBoardState = false;

    cellSequences.forEach(function (cellSequence) {
        var tilesMerged = false;
        
        cellSequence.forEach(function (cell) {
            if (board.occupied(cell)) {
                var trajectory = self._planTrajectoryFor(cell, shiftDirection, board);

                var shouldTryToMove = true;
                if (trajectory.tileToCrashWithExists) {
                    var tile = board.tileIn(cell);
                    var tileToCrashWith = board.tileIn(trajectory.occupiedCell);

                    if (!tilesMerged && self._shouldMergeTiles(tile, tileToCrashWith)) {
                        tileToCrashWith.mergeWith(tile);
                        board.removeTileFromCell(cell);

                        shouldTryToMove = false;
                        tilesMerged = true;
                        managedToChangeBoardState = true;
                    }
                }
                if (shouldTryToMove && trajectory.thereIsEnoughRoomToMove) {
                    self._moveTileFromTo(cell, trajectory.farthestAvailableCell, board);

                    managedToChangeBoardState = true;
                }
            }
        });
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
    return tileToCrashWith.value === tile.value;
};

GameReferee.prototype._moveTileFromTo = function (cellFrom, cellTo, board) {
    var tile = board.tileIn(cellFrom);
    board.removeTileFromCell(cellFrom);
    board.putTileIntoCell(tile, cellTo);
};
