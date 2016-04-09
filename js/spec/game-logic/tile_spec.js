describe("Tile", function () {
    var tile;

    beforeEach(function () {
        tile = new Tile(2);
    });

    it("should be initialized properly", function () {
        expect(tile.value).toEqual(2);
    });

    it("tiles with the same value should be the same", function () {
        var anotherTile = new Tile(2);
        expect(tile.sameAs(anotherTile)).toBeTruthy();
    });

    it("tiles with different values shouldn't be the same", function () {
        var anotherTile = new Tile(4);
        expect(tile.sameAs(anotherTile)).toBeFalsy();
    });

    describe("when merged with another tile", function () {
        var anotherTile;

        beforeEach(function () {
            anotherTile = new Tile(4);
            tile.mergeWith(anotherTile);
        });

        it("should sum up the values for both tiles", function () {
            expect(tile.value).toEqual(6);
        });
    });
});
