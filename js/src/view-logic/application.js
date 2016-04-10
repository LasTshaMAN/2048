window.requestAnimationFrame(function () {
    var board = new Board(4);
    var referee = new GameReferee();
    var actuator = new HTMLActuator();

    referee.setupNewGameOn(board);
    actuator.drawCurrentGameBoard(board);

    var scheduleNextMove = function (delay) {
        var actions = [
            "up",
            "right",
            "down",
            "left"
        ];
        setTimeout(function () {
            var prevBoard = board.clone();
            actuator.drawPreviousGameBoard(prevBoard);

            try {
                var action = actions[Math.floor(Math.random() * actions.length)];
                referee.makeMoveOnBoard(action, board);
                actuator.drawActionArrow(action);
                referee.putRandomTileOn(board);

            } catch (e) {
                if (e.type !== "Illegal Move Exception") {
                    throw e;
                }
            }

            actuator.drawCurrentGameBoard(board);

            if (!referee.saysGameIsOverOn(board)) {
                scheduleNextMove(delay);
            }
        }, delay);
    };

    scheduleNextMove(500);
});