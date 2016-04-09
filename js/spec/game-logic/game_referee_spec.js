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

    it("should say that game isn't over if board is empty", function () {
        expect(gameReferee.saysGameIsOver(board)).toBeFalsy();
    });

    it("should say that game isn't over if board is half-full", function () {
        gameReferee.setupNewGameOn(board);
        gameReferee.putRandomTileOn(board);
        gameReferee.putRandomTileOn(board);
        gameReferee.putRandomTileOn(board);
        expect(gameReferee.saysGameIsOver(board)).toBeFalsy();
    });

    it("should say that game isn't over if there are some tiles to merge on board", function () {
        board.forEachCell(function (cell) {
            var tile = new Tile(2);
            board.putTileIntoCell(tile, cell);
        });
        expect(gameReferee.saysGameIsOver(board)).toBeFalsy();
    });
    
    it("should say that game is over if board state can't be changed further", function () {
        var value = 2;
        board.forEachCell(function (cell) {
            var tile = new Tile(value);
            board.putTileIntoCell(tile, cell);
            value *= 2;
        });
        expect(gameReferee.saysGameIsOver(board)).toBeTruthy();
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

            gameReferee.makeMoveOnBoard("up", board);
        });

        describe("should shift the tile properly:", function () {
            it("tile_0_0", function () {
                expect(board.tileIn({x: 0, y: 0})).toEqual(tile_0_0);
            });

            it("tile_2_0", function () {
                expect(board.tileIn({x: 1, y: 0})).toEqual(tile_2_0);
            });

            it("tile_2_2", function () {
                expect(board.tileIn({x: 1, y: 2})).toEqual(tile_2_2);
            });

            it("tile_3_2", function () {
                expect(board.tileIn({x: 2, y: 2})).toEqual(tile_3_2);
            });

            it("tile_2_3", function () {
                expect(board.tileIn({x: 1, y: 3})).toEqual(tile_2_3);
            });

            it("tile_3_3", function () {
                expect(board.tileIn({x: 2, y: 3})).toEqual(tile_3_3);
            });
        });

        describe("shouldn't merge tiles with different values:", function () {
            it("tile_0_0", function () {
                expect(tile_0_0.wasMerged()).toBeFalsy();
            });

            it("tile_2_2", function () {
                expect(tile_2_2.wasMerged()).toBeFalsy();
            });

            it("tile_1_3", function () {
                expect(tile_1_3.wasMerged()).toBeFalsy();
            });
        });

        describe("should merge distant tiles with the same value if tile to merge with is fixed", function () {
            it("tile_0_1", function () {
                expect(tile_0_1.wasMerged()).toBeTruthy();
            });
        });

        describe("should merge adjacent tiles with the same value", function () {
            it("tile_0_2", function () {
                expect(tile_0_2.wasMerged()).toBeTruthy();
            });
            it("tile_0_3", function () {
                expect(tile_0_3.wasMerged()).toBeTruthy();
            });
        });

        describe("shouldn't merge adjacent tiles with the same value if the tile ahead is going to merge with another tile", function () {
            it("tile_1_2", function () {
                expect(tile_1_2.wasMerged()).toBeFalsy();
            });
        });

        describe("shouldn't merge adjacent tiles with the same value if the tile ahead is going to move", function () {
            it("tile_2_3", function () {
                expect(tile_2_3.wasMerged()).toBeFalsy();
            });
        });

        describe("new tiles shouldn't appear out of nowhere", function () {
            it("tile_2_0", function () {
                expect(board.occupied({x: 2, y: 0})).toBeFalsy();
            });

            it("tile_3_0", function () {
                expect(board.occupied({x: 3, y: 0})).toBeFalsy();
            });

            it("tile_1_1", function () {
                expect(board.occupied({x: 1, y: 1})).toBeFalsy();
            });

            it("tile_2_1", function () {
                expect(board.occupied({x: 2, y: 1})).toBeFalsy();
            });

            it("tile_3_1", function () {
                expect(board.occupied({x: 3, y: 1})).toBeFalsy();
            });

            it("tile_3_2", function () {
                expect(board.occupied({x: 3, y: 2})).toBeFalsy();
            });

            it("tile_3_3", function () {
                expect(board.occupied({x: 3, y: 3})).toBeFalsy();
            });
        });
    });
});
