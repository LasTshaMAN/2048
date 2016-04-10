function HTMLActuator() {
}

HTMLActuator.prototype.drawActionArrow = function (action) {
    var self = this;

    window.requestAnimationFrame(function () {
        var actionNodes = $(".actions-upon-transition").children();

        self._clearLastAction(actionNodes);

        var actionClasses = {
            "up": "move-up",
            "right": "move-right",
            "down": "move-down",
            "left": "move-left"
        };
        var actionClass = actionClasses[action];
        self._makeActionClassOpaque(actionClass, actionNodes);
    });
};

HTMLActuator.prototype._clearLastAction = function (actionNodes) {
    actionNodes.each(function () {
        $(this).removeClass("chosen-action");
    });
};

HTMLActuator.prototype._makeActionClassOpaque = function (actionClass, actionNodes) {
    actionNodes.each(function () {
        if ($(this).hasClass(actionClass)) {
            $(this).addClass("chosen-action");
        }
    });
};

HTMLActuator.prototype.drawPreviousGameBoard = function (board) {
    var self = this;

    window.requestAnimationFrame(function () {
        var previousBoardTileContainerNode = $(".prev-game-board .tile-container");
        self._drawBoard(previousBoardTileContainerNode, board);
    });
};

HTMLActuator.prototype.drawCurrentGameBoard = function (board) {
    var self = this;

    window.requestAnimationFrame(function () {
        var boardTileContainerNode = $(".game-board .tile-container");
        self._drawBoard(boardTileContainerNode, board);
    });
};

HTMLActuator.prototype._drawBoard = function (tileContainerNode, board) {
    var self = this;
    
    this._clearContainer(tileContainerNode);

    board.forEachCell(function (cell) {
        var tile = board.tileIn(cell);
        if (tile !== null) {
            var tileNode =  self._createTileForCell(tile, cell);
            self._putTileIntoTileContainer(tileNode, tileContainerNode);
        }
    });
};

HTMLActuator.prototype._createTileForCell = function (tile, cell) {
    var classes = this._generateClassesForWrapper(tile, cell);
    var wrapper = document.createElement("div");
    this._applyClasses(wrapper, classes);

    var inner = document.createElement("div");
    inner.classList.add("tile-inner");
    inner.textContent = tile.value;

    wrapper.appendChild(inner);
    return wrapper;
};

HTMLActuator.prototype._generateClassesForWrapper = function (tile, cell) {
    var result = [
        "tile",
        "tile-" + tile.value,
        this._positionClass(cell)
        // "tile-new"
    ];

    if (tile.value > 2048) {
        result.push("tile-super");
    }

    return result;
};

HTMLActuator.prototype._applyClasses = function (element, classes) {
    element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype._positionClass = function (cell) {
    cell = this._normalizePosition(cell);
    return "tile-position-" + cell.x + "-" + cell.y;
};

HTMLActuator.prototype._normalizePosition = function (cell) {
    return {x: cell.x + 1, y: cell.y + 1};
};

HTMLActuator.prototype._putTileIntoTileContainer = function (tileNode, tileContainerNode) {
    tileContainerNode.append(tileNode);
};

HTMLActuator.prototype.drawScore = function (score) {
    var self = this;

    window.requestAnimationFrame(function () {
        var scoresContainerNode = $(".score-container");

        self._clearContainer(scoresContainerNode);

        self._fillInNewScore(scoresContainerNode, score.value);

        var scoreDifference = score.value - score.previousValue;
        if (scoreDifference > 0) {
            self._createScoreDifferenceNode(scoresContainerNode, scoreDifference);
        }
    });
};

HTMLActuator.prototype._clearContainer = function (container) {
    container.empty();
};

HTMLActuator.prototype._fillInNewScore = function (scoresContainerNode, newScore) {
    scoresContainerNode.textContent = newScore;
};

HTMLActuator.prototype._createScoreDifferenceNode = function (scoresContainerNode, scoreDifference) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + scoreDifference;

    scoresContainerNode.append(addition);
};
