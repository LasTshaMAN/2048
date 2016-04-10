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
            try {
                var prevBoard = board.clone();

                var action = actions[Math.floor(Math.random() * actions.length)];
                referee.tryToMakeMoveOnBoard(action, board);

                actuator.drawPreviousGameBoard(prevBoard);
                actuator.drawActionArrow(action);
                actuator.drawCurrentGameBoard(board);

                referee.putRandomTileOn(board);

                actuator.drawCurrentGameBoard(board);

            } catch (e) {
                if (e.type !== "Illegal Move Exception") {
                    throw e;
                }
            }

            if (!referee.saysGameIsOverOn(board)) {
                scheduleNextMove(delay);
            }
        }, delay);
    };

    scheduleNextMove(5000);
});