/**
 * This a Front End
 */
const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.getElementById('gameStatus');
const endGameStatus = document.getElementById('endGameStatus');
const playerOne = 'X';const playerTwo = 'O';
let playerTurn = playerOne;

/**
 * This a Back End
 */
const nom = localStorage.getItem('name');
const difficulter = localStorage.getItem('dificulty');
const joueurType = localStorage.getItem('playerType');
const aiPlayer = joueurType === playerOne ? playerTwo : playerOne;
document.getElementById('stat').textContent = aiPlayer;

// const csvFile = "morpion.csv";

/*--FRONT--*/
document.getElementById('name').textContent = nom;
document.getElementById('difficulty').textContent = difficulter;
document.getElementById('playerType').textContent = joueurType;
/**
 * Fullstack Work
 */
const winningPattern = [
    [0 , 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]
]

cells.forEach(cell => {
    cell.addEventListener('click', playGame, { once: true });
});

function getEmptyCells() {
    const emptyCells = [];

    cells.forEach((cell, index) => {
        if (cell.innerHTML === '') {
        emptyCells.push(index);
        }
    });
    document.getElementById('stat').textContent = 1;
return emptyCells;
}

/*------Minimax Algorithm-------*/
function checkWinsAttribute() {
    if (checkWin(playerOne)) {
        return 10;
    } else if (checkWin(playerTwo)) {
        return -10;
    } else if (checkDraw()) {
        return 0;
    }
    document.getElementById('stat').textContent = 2;
}

function minEvaluation(board, noeud) {
    let maxEval = -9999;

    for (let move of getEmptyCells()) {
        board[move] = playerOne;
        let eval = minimaxFunction(board , noeud + 1, false);
        board[move] = '';

        if (eval > maxEval) {
            maxEval = eval;
            document.getElementById('stat').textContent = 3;
        }
    }

    return maxEval;
}

function maxEvaluation(board, noeud) {
    let minEval = 9999;

    for (let move of getEmptyCells()) {
        board[move] = playerTwo;
        let eval = minimaxFunction(board, noeud + 1, true);
        board[move] = '';

        if(eval < minEval) {
            minEval = eval;
            document.getElementById('stat').textContent = 4;
        }
    }

    return minEval;
}

function minimaxFunction(board, noeud, maximizingPlayer) {
    const winAttribute = checkWinsAttribute();
    document.getElementById('stat').textContent = 5;

    if (winAttribute !== 0) {
        return winAttribute;
    }

    if (maximizingPlayer) {
       return maxEvaluation([...board], noeud);
    } else {
       return minEvaluation([...board], noeud);
    }
}

function makeAIMinimaxMove() {
    const emptyCells = getEmptyCells();

    if (emptyCells.length === 0 || checkWin(playerOne) || checkWin(playerTwo) || checkDraw()) {
        return;
    }

    const bestMove = minimaxFunction([...cells], 0, true);

    if (bestMove && bestMove.cell) {
        const selectedCell = bestMove.cell;
        selectedCell.innerHTML = aiPlayer;

        if (checkWin(playerTurn)) {
            updateGameStatus("wins" + aiPlayer);
            endGame();
        } else if (checkDraw()) {
            updateGameStatus("draw");
            endGame();
        }
        playerTurn = playerTurn === playerOne ? playerTwo : playerOne;
    }
}


/*--Normal Dificulty IA--*/
// function addFile(csvFile) {
//     fetch(csvFile)
//       .then(response => response.text())
//       .then(data => { const rows = data.split('\n') });
// }

/*--Procedure--*/
function playGame(e) {
    e.target.innerHTML = playerTurn;

    if (checkWin(playerTurn)) {
        updateGameStatus("wins" + playerTurn);
        return endGame();
    } else if (checkDraw()) {
        updateGameStatus("draw");
        return endGame();
    }

    updateGameStatus(playerTurn);
    playerTurn = playerTurn === playerOne ? playerTwo : playerOne;

    if (difficulter === 'hard' && aiPlayer === playerOne) {
        makeAIMinimaxMove();
        updateGameStatus(playerTurn);
        document.getElementById('stat').textContent = 8;
    } else if (difficulter === 'hard' && aiPlayer === playerTwo) {
        setTimeout(() => {
            makeAIMinimaxMove();
            updateGameStatus(playerTurn);
            document.getElementById('stat').textContent = 9;
        }, 100);
    }
}


/**
 * Checking Update Status
 */
function checkWin(playerTurn) {
    return winningPattern.some(combination => {
        return combination.every(index => {
            return cells[index].innerHTML == playerTurn;
        });
    });
}

function checkDraw() {
    return [...cells].every(cell => {
        return cell.innerHTML == playerOne || cell.innerHTML == playerTwo;
    });
}

function updateGameStatus(status) {
    let statusText ;

    switch (status) {
        case 'X':
            statusText = "Turn Player Two";
            break;
        case 'O':
            statusText = "Turn Player One";
            break;
        case 'winsX':
            statusText = "Player One Wins";
            break;
        case 'winsO':
            statusText = "Player Two Wins";
            break;
        case 'draw':
            statusText = "The match ended in a draw";
            break;
    }

    gameStatus.innerHTML = statusText;
    endGameStatus.innerHTML = statusText;
}

function endGame() {
    document.getElementById('gameEnd').style.display = "block" ;
    localStorage.removeItem('name');
    localStorage.removeItem('dificulty');
    localStorage.removeItem('playerType');
}

function reloadGame() { window.location.href = 'index.html' }