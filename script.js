/* 
TODO:
1. [X] Create an object to store player information like: name, symbol, total score.
2. [X] Create a function allow player to place their symbol on the board. Input are:
   player name, selected row and colum.
3. [X] Create a function print aout the gameboard with recent change (like when player
   just place one of their symbol).
4. [X] Create a function that switch player's turn.
5. [X] Create a factory function to keep track of each cell on the gameboard (which cell
   has symbol of which player on and which cell hasn't).
6. [X] Create a GameController factory function that responsible for controlling the 
   flow and state of the game's turn.
7. [X] Implement a win condition and give one score to winner. 
8. [X] Give board a blank slate after declare a winner of that round.
9. [X] Implement a tie condition.
10. [X] Draw a grid, and center it on the browser screen.
11. [X] Add event listener to each cell on click.
12. [X] Add labels for player1 and player2 for their name.
13. [X] Add some basic stylized element: font-family, font-size, color,...
14. [X] Use javascript to display change label when switch between player turn like: color on focus,...
15. [] When a symbol is placed, draw it onto the board.
*/

function Cell() {
  let value = " ";

  function addSymbol(playerSymbol) {
    value = value.replace(value, playerSymbol);
  }

  const getValue = () => value;

  return { addSymbol, getValue };
}

function createPlayer(name, symbol) {
  let score = 0;
  const getScore = () => score;
  const giveScore = () => score++;
  return { name, symbol, getScore, giveScore };
}

const GameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const maximumPlacement = rows * columns;
  let board = [];

  const getColumn = () => columns;
  const getMaxPlacement = () => maximumPlacement;
  const getBoard = () => board;

  for (let i = 0; i < rows; i++) {
    // For each row, asign an empty array
    // that represent a column.
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      // For each column in a row, add
      // a cell to that column.
      board[i].push(Cell());
    }
  }

  const getBoardWithValues = () => {
    return board.map((row) =>
      row.map((cell) => {
        return cell.getValue();
      })
    );
  };

  const printBoard = () => {
    const boardWithCellValues = getBoardWithValues();
    console.log(boardWithCellValues);
  };

  const placeSymbol = (playerSymbol, row, column) => {
    board[row][column].addSymbol(playerSymbol);
  };

  function clearBoard() {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.addSymbol(" ");
      });
    });
  }

  return {
    getColumn,
    getBoard,
    placeSymbol,
    printBoard,
    getBoardWithValues,
    clearBoard,
    getMaxPlacement,
  };
})();

function GameController(playerOneName, playerTwoName) {
  const board = GameBoard;
  const player1 = createPlayer(playerOneName, "X");
  const player2 = createPlayer(playerTwoName, "O");
  const playerOneLabel = document.getElementById("player1");
  const playerTwoLabel = document.getElementById("player2");

  let numberOfPlacement = 0;
  let activePlayer = player1;
  playerOneLabel.style.color = "#ff0000";

  const getCurrentPlayer = () => activePlayer;

  const changePlayerNameStyle = (activePlayer, inactivePlayer) => {
    inactivePlayer.style.color = "#000000";
    activePlayer.style.color = "#ff0000";
  };

  const switchPlayerTurn = () => {
    if (activePlayer.name === player1.name) {
      activePlayer = player2;
      changePlayerNameStyle(playerTwoLabel, playerOneLabel);
    } else {
      activePlayer = player1;
      changePlayerNameStyle(playerOneLabel, playerTwoLabel);
    }
  };

  const printRoundMessage = () => {
    console.log(`It's ${activePlayer.name}'s turn`);
    board.printBoard();
  };

  const resetGame = () => {
    console.log("A new round has started.");
    board.clearBoard();
    printRoundMessage();
  };

  const checkWinCondition = (playerSymbol, board) => {
    let isWin = false;
    const totalCol = board.getColumn();
    const boardWithValues = board.getBoardWithValues();

    const compareSymbol = (value) => value === playerSymbol;

    /* Check for each cell in a row. Use every */
    function checkRow() {
      for (let row of boardWithValues) {
        if (row.every(compareSymbol)) return true;
        // else return false;
      }
    }

    /*  Check for each cell in a column */
    function checkColumn() {
      for (let i = 0; i < totalCol; i++) {
        const col = boardWithValues.map((cell) => {
          return cell[i];
        });

        if (col.every(compareSymbol)) return true;
        // else return false;
      }
    }

    /* Check each cell in a diagonal */
    function checkDiagonal() {
      // Diagonal from top left to bottom right
      const isLinearTrue = boardWithValues
        .map(function (cell, index) {
          return cell[index]; // index increase for each subsequence loop
        })
        .every(compareSymbol);

      // Diagonal from bottom left to top right
      const isReverseTrue = boardWithValues
        .toReversed()
        .map(function (cell, index) {
          return cell[index];
        })
        .every(compareSymbol);

      if (isLinearTrue || isReverseTrue) return true;
    }

    if (checkRow() || checkColumn() || checkDiagonal()) isWin = true;

    return isWin;
  };

  const playGame = (inputRow, inputCol) => {
    numberOfPlacement++;
    board.placeSymbol(activePlayer.symbol, inputRow, inputCol);
    let winCondition = checkWinCondition(activePlayer.symbol, board);

    // Check win condition
    if (winCondition) {
      board.printBoard();
      activePlayer.giveScore();
      console.log(`${activePlayer.name} has won!`);
      console.log(`${activePlayer.name}'s score is: ${activePlayer.getScore()}`);
    } else {
      switchPlayerTurn();
      printRoundMessage();
    }

    // Check tie condition
    if (numberOfPlacement >= board.getMaxPlacement()) {
      console.log("It's a tie");
    }
  };

  function addEventToGridItems() {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.addEventListener("click", function () {
        playGame(cell.closest("tr").rowIndex, cell.cellIndex);
      });
    });
  }

  addEventToGridItems();
  printRoundMessage();

  return { getCurrentPlayer, playGame, resetGame };
}

const game = GameController("Minh", "BOT");

// TEST1: Minh win by row.
// game.playGame(1, 0);
// game.playGame(0, 0);
// game.playGame(1, 1);
// game.playGame(0, 1);
// game.playGame(1, 2);

// TEST2: BOT win by column
// game.playGame(0, 0);
// game.playGame(0, 1);
// game.playGame(0, 2);
// game.playGame(1, 1);
// game.playGame(1, 0);
// game.playGame(2, 1);

// TEST3: Minh win by diagonal
// game.playGame(0, 0);
// game.playGame(0, 1);
// game.playGame(1, 1);
// game.playGame(1, 2);
// game.playGame(2, 2);
// game.playGame(2, 1);

// TEST4: A tie game.
// game.playGame(0, 0);
// game.playGame(0, 1);
// game.playGame(0, 2);
// game.playGame(1, 1);
// game.playGame(1, 0);
// game.playGame(1, 2);
// game.playGame(2, 1);
// game.playGame(2, 0);
// game.playGame(2, 2);
