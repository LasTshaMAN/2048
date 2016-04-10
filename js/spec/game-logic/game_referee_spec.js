describe("GameReferee", function () {
    var gameReferee;
    var board;

    beforeEach(function () {
        gameReferee = new GameReferee();
        board = new Board(4);
    });

    it("should put 2 tiles on board upon setup", function () {
        gameReferee.setupNewGameOn(board);

        var amountOfOccupiedCells = 0;
        board.forEachCell(function (cell) {
            if (board.occupied(cell)) {
                amountOfOccupiedCells += 1;
            }
        });
        expect(amountOfOccupiedCells).toEqual(2);
    });

    describe("when checking whether the game is over", function () {
        it("should say that game isn't over if board is empty", function () {
            expect(gameReferee.saysGameIsOverOn(board)).toBeFalsy();
        });

        it("should say that game isn't over if board is half-full", function () {
            gameReferee.setupNewGameOn(board);
            gameReferee.putRandomTileOn(board);
            gameReferee.putRandomTileOn(board);
            gameReferee.putRandomTileOn(board);
            expect(gameReferee.saysGameIsOverOn(board)).toBeFalsy();
        });

        describe("should say that game isn't over if there are some tiles to merge on board", function () {
            it("case 1", function () {
                board.forEachCell(function (cell) {
                    var tile = new Tile(2);
                    board.putTileIntoCell(tile, cell);
                });
                expect(gameReferee.saysGameIsOverOn(board)).toBeFalsy();
            });

            it("case 2", function () {
                board.putTileIntoCell(new Tile(4), {x: 0, y: 0});
                board.putTileIntoCell(new Tile(8), {x: 0, y: 1});
                board.putTileIntoCell(new Tile(16), {x: 0, y: 2});
                board.putTileIntoCell(new Tile(2), {x: 0, y: 3});
                board.putTileIntoCell(new Tile(2), {x: 1, y: 0});
                board.putTileIntoCell(new Tile(16), {x: 1, y: 1});
                board.putTileIntoCell(new Tile(64), {x: 1, y: 2});
                board.putTileIntoCell(new Tile(2), {x: 1, y: 3});
                board.putTileIntoCell(new Tile(2), {x: 2, y: 0});
                board.putTileIntoCell(new Tile(4), {x: 2, y: 1});
                board.putTileIntoCell(new Tile(32), {x: 2, y: 2});
                board.putTileIntoCell(new Tile(16), {x: 2, y: 3});
                board.putTileIntoCell(new Tile(2), {x: 3, y: 0});
                board.putTileIntoCell(new Tile(8), {x: 3, y: 1});
                board.putTileIntoCell(new Tile(4), {x: 3, y: 2});
                board.putTileIntoCell(new Tile(2), {x: 3, y: 3});

                expect(gameReferee.saysGameIsOverOn(board)).toBeFalsy();
            });
        });

        it("should say that game is over if board state can't be changed any further", function () {
            var value = 2;
            board.forEachCell(function (cell) {
                var tile = new Tile(value);
                board.putTileIntoCell(tile, cell);
                value *= 2;
            });
            expect(gameReferee.saysGameIsOverOn(board)).toBeTruthy();
        });
    });

    describe("when making 'up-move'", function () {
        var tile_0_0;
        var tile_0_1;
        var tile_0_2;
        var tile_0_3;
        var tile_1_2;
        var tile_1_3;
        var tile_2_0;
        var tile_2_2;
        var tile_2_3;
        var tile_3_1;
        var tile_3_2;
        var tile_3_3;

        beforeEach(function () {
            tile_0_0 = new Tile(8);
            tile_0_1 = new Tile(2);
            tile_0_2 = new Tile(4);
            tile_0_3 = new Tile(2);
            tile_1_2 = new Tile(4);
            tile_1_3 = new Tile(2);
            tile_2_0 = new Tile(32);
            tile_2_2 = new Tile(4);
            tile_2_3 = new Tile(16);
            tile_3_1 = new Tile(2);
            tile_3_2 = new Tile(8);
            tile_3_3 = new Tile(16);

            board.putTileIntoCell(tile_0_0, {x: 0, y: 0});
            board.putTileIntoCell(tile_0_1, {x: 0, y: 1});
            board.putTileIntoCell(tile_0_2, {x: 0, y: 2});
            board.putTileIntoCell(tile_0_3, {x: 0, y: 3});
            board.putTileIntoCell(tile_1_2, {x: 1, y: 2});
            board.putTileIntoCell(tile_1_3, {x: 1, y: 3});
            board.putTileIntoCell(tile_2_0, {x: 2, y: 0});
            board.putTileIntoCell(tile_2_2, {x: 2, y: 2});
            board.putTileIntoCell(tile_2_3, {x: 2, y: 3});
            board.putTileIntoCell(tile_3_1, {x: 3, y: 1});
            board.putTileIntoCell(tile_3_2, {x: 3, y: 2});
            board.putTileIntoCell(tile_3_3, {x: 3, y: 3});

            gameReferee.tryToMakeMoveOnBoard("up", board);
        });

        it("should shift the tile properly", function () {
            expect(board.tileIn({x: 0, y: 0})).toEqual(tile_0_0);
            expect(board.tileIn({x: 1, y: 0})).toEqual(tile_2_0);
            expect(board.tileIn({x: 1, y: 2})).toEqual(tile_2_2);
            expect(board.tileIn({x: 2, y: 2})).toEqual(tile_3_2);
            expect(board.tileIn({x: 1, y: 3})).toEqual(tile_2_3);
            expect(board.tileIn({x: 2, y: 3})).toEqual(tile_3_3);
        });

        it("shouldn't merge tiles with different values", function () {
            expect(tile_0_0.value).toEqual(8);
            expect(tile_2_2.value).toEqual(4);
            expect(tile_1_3.value).toEqual(2);
        });

        it("should merge distant tiles with the same value if tile to merge with is fixed", function () {
            expect(tile_0_1.value).toEqual(4);
        });

        it("should merge adjacent tiles with the same value", function () {
            expect(tile_0_2.value).toEqual(8);
            expect(tile_0_3.value).toEqual(4);
        });

        it("shouldn't merge adjacent tiles with the same value if the tile ahead is going to merge with another tile", function () {
            expect(tile_1_2.value).toEqual(4);
        });

        it("shouldn't merge adjacent tiles with the same value if the tile ahead is going to move", function () {
            expect(tile_2_3.value).toEqual(16);
        });

        it("new tiles shouldn't appear out of nowhere", function () {
            expect(board.occupied({x: 2, y: 0})).toBeFalsy();
            expect(board.occupied({x: 3, y: 0})).toBeFalsy();
            expect(board.occupied({x: 1, y: 1})).toBeFalsy();
            expect(board.occupied({x: 2, y: 1})).toBeFalsy();
            expect(board.occupied({x: 3, y: 1})).toBeFalsy();
            expect(board.occupied({x: 3, y: 2})).toBeFalsy();
            expect(board.occupied({x: 3, y: 3})).toBeFalsy();
        });
    });

    describe("when trying to make illegal move should throw Illegal Move Exception", function () {
        it("on full board", function () {
            board.putTileIntoCell(new Tile(4), {x: 0, y: 0});
            board.putTileIntoCell(new Tile(8), {x: 0, y: 1});
            board.putTileIntoCell(new Tile(16), {x: 0, y: 2});
            board.putTileIntoCell(new Tile(2), {x: 0, y: 3});
            board.putTileIntoCell(new Tile(2), {x: 1, y: 0});
            board.putTileIntoCell(new Tile(16), {x: 1, y: 1});
            board.putTileIntoCell(new Tile(64), {x: 1, y: 2});
            board.putTileIntoCell(new Tile(2), {x: 1, y: 3});
            board.putTileIntoCell(new Tile(2), {x: 2, y: 0});
            board.putTileIntoCell(new Tile(4), {x: 2, y: 1});
            board.putTileIntoCell(new Tile(32), {x: 2, y: 2});
            board.putTileIntoCell(new Tile(16), {x: 2, y: 3});
            board.putTileIntoCell(new Tile(2), {x: 3, y: 0});
            board.putTileIntoCell(new Tile(8), {x: 3, y: 1});
            board.putTileIntoCell(new Tile(4), {x: 3, y: 2});
            board.putTileIntoCell(new Tile(2), {x: 3, y: 3});

            expect(
                function () {
                    gameReferee.tryToMakeMoveOnBoard("left", board);
                }
            ).toThrow(
                {
                    type: "Illegal Move Exception"
                }
            );
        });

        it("on half-empty board", function () {
            board.putTileIntoCell(null, {x: 0, y: 0});
            board.putTileIntoCell(null, {x: 0, y: 1});
            board.putTileIntoCell(null, {x: 0, y: 2});
            board.putTileIntoCell(null, {x: 0, y: 3});
            board.putTileIntoCell(null, {x: 1, y: 0});
            board.putTileIntoCell(null, {x: 1, y: 1});
            board.putTileIntoCell(null, {x: 1, y: 2});
            board.putTileIntoCell(null, {x: 1, y: 3});
            board.putTileIntoCell(null, {x: 2, y: 0});
            board.putTileIntoCell(null, {x: 2, y: 1});
            board.putTileIntoCell(null, {x: 2, y: 2});
            board.putTileIntoCell(null, {x: 2, y: 3});
            board.putTileIntoCell(new Tile(2), {x: 3, y: 0});
            board.putTileIntoCell(new Tile(4), {x: 3, y: 1});
            board.putTileIntoCell(new Tile(8), {x: 3, y: 2});
            board.putTileIntoCell(new Tile(4), {x: 3, y: 3});

            expect(
                function () {
                    gameReferee.tryToMakeMoveOnBoard("down", board);
                }
            ).toThrow(
                {
                    type: "Illegal Move Exception"
                }
            );
        });
    });
});
