describe("GameLogic", function () {
    var gameReferee;
    var board;

    beforeEach(function () {
        gameReferee = new GameReferee();
        board = new Board(4);
    });

    it("test_1", function () {
        board.putTileIntoCell(new Tile(2), {x: 0, y: 0});
        board.putTileIntoCell(new Tile(8), {x: 0, y: 1});
        board.putTileIntoCell(new Tile(2), {x: 0, y: 2});
        board.putTileIntoCell(new Tile(16), {x: 0, y: 3});
        board.putTileIntoCell(new Tile(32), {x: 1, y: 0});
        board.putTileIntoCell(new Tile(2), {x: 1, y: 1});
        board.putTileIntoCell(new Tile(32), {x: 1, y: 2});
        board.putTileIntoCell(new Tile(2), {x: 1, y: 3});
        board.putTileIntoCell(new Tile(2), {x: 2, y: 0});
        board.putTileIntoCell(new Tile(32), {x: 2, y: 1});
        board.putTileIntoCell(new Tile(16), {x: 2, y: 2});
        board.putTileIntoCell(new Tile(8), {x: 2, y: 3});
        board.putTileIntoCell(new Tile(8), {x: 3, y: 0});
        board.putTileIntoCell(new Tile(2), {x: 3, y: 1});
        board.putTileIntoCell(null, {x: 3, y: 2});
        board.putTileIntoCell(new Tile(2), {x: 3, y: 3});

        gameReferee.makeMoveOnBoard("down", board);

        expect(board.tileIn({x: 0, y: 0}).value).toEqual(2);
        expect(board.tileIn({x: 0, y: 1}).value).toEqual(8);
        expect(board.occupied({x: 0, y: 2})).toBeFalsy();
        expect(board.tileIn({x: 0, y: 3}).value).toEqual(16);
        expect(board.tileIn({x: 1, y: 0}).value).toEqual(32);
        expect(board.tileIn({x: 1, y: 1}).value).toEqual(2);
        expect(board.tileIn({x: 1, y: 2}).value).toEqual(2);
        expect(board.tileIn({x: 1, y: 3}).value).toEqual(2);
        expect(board.tileIn({x: 2, y: 0}).value).toEqual(2);
        expect(board.tileIn({x: 2, y: 1}).value).toEqual(32);
        expect(board.tileIn({x: 2, y: 2}).value).toEqual(32);
        expect(board.tileIn({x: 2, y: 3}).value).toEqual(8);
        expect(board.tileIn({x: 3, y: 0}).value).toEqual(8);
        expect(board.tileIn({x: 3, y: 1}).value).toEqual(2);
        expect(board.tileIn({x: 3, y: 2}).value).toEqual(16);
        expect(board.tileIn({x: 3, y: 3}).value).toEqual(2);
    });
});
