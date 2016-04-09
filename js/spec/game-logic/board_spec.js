describe("Board", function () {
    var board;
    var size = 4;

    beforeEach(function () {
        board = new Board(size);
    });

    it("should be empty upon initialization", function () {
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                var cell = {
                    x: x,
                    y: y
                };
                expect(board.occupied(cell)).toBeFalsy();
            }
        }
    });

    describe("when I put a tile on the board", function () {
        var tile;
        var cell;

        beforeEach(function () {
            tile = new Tile(2);
            cell = {
                x: 1,
                y: 2
            };
            board.putTileIntoCell(tile, cell);
        });

        it("the cell to accommodate that tile should become occupied", function () {
            expect(board.occupied(cell)).toBeTruthy();
        });

        it("I should be able to successfully extract that tile from the cell it occupies", function () {
            var extractedTile = board.tileIn(cell);
            expect(extractedTile).toEqual(tile);
        });

        it("I should be able to successfully remove that tile from the cell it occupies", function () {
            board.removeTileFromCell(cell);
            expect(board.occupied(cell)).toBeFalsy();
        });
    });

    it("should allow to apply action for each cell", function () {
        var visitedCells = [];
        board.forEachCell(function (cell) {
            visitedCells.push(cell);
        });

        expect(visitedCells.length).toEqual(board.size * board.size);

        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                var cell = {
                    x: x,
                    y: y
                };
                expect(visitedCells).toContain(cell);
            }
        }
    });
});
