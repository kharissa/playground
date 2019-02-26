const gamebox = document.getElementById('t-box-container');
const resetButton = document.getElementById('reset-button');
const resetContainer = document.getElementById('reset-container');
const turnContainer = document.getElementById('turn-container');
const gameStartForm = document.getElementById('game-options');
const playerContainer = document.getElementById('playerTurn');
const intro = document.getElementById('game-intro');

let playerOne = [];
let playerTwo = []; 
let winningCombos = [];
let possibleMoves = [];
let turnCount = 0;
let result;
let currentPlayer = 'Player One';
let size;
let computer = false;

function startGame(event) {
    event.preventDefault();
    size = gameStartForm.elements["game-size-input"].value;
    if (gameStartForm.elements["computer"].checked) {
        computer = true;
    }
    generateGameBox(size);

    // Show Gamebox
    gamebox.classList.remove('hidden');
    turnContainer.classList.remove('hidden');
    resetContainer.classList.remove('hidden');

    // Hide Game Options  
    intro.classList.add('hidden');
}

function generateCombos(num) {
    let diagonalRight = [];
    let diagonalLeft = [];

    for (let i = 0; i < num; i++) {

        // Generate horizontal combos
        let row = [];
        for (let j = 0; j < num; j++) {
            const position = 'position' + [i] + [j];
            row.push(position);
            possibleMoves.push('position' + [i] + [j]); // Create array of all possible moves
        }
        winningCombos.push(row);

        // Generate vertical combos
        let column = [];
        for (let k = 0; k < num; k++) {
            const position = 'position' + [k] + [i];
            column.push(position);
        }
        winningCombos.push(column);

        // Generate diagonal right combo
        diagonalRight.push('position' + [i] + [i]);

        // Generate diagonal left combo
        diagonalLeft.push('position' + [i] + [num - 1 - i]);
    }

    // Add all winning combos to array
    winningCombos.push(diagonalRight);
    winningCombos.push(diagonalLeft);
}

function generateGameBox(num) {
    for (let i = 0; i < num; i++) { // create num rows
        const row = document.createElement('div');
        row.classList.add('row', 'justify-content-center');

        for (let j = 0; j < num; j++) { // create num squares per row
            const position = 'position' + [i] + [j];
            const square = document.createElement('div');
            square.classList.add('t-box');
            square.setAttribute('id', position);
            row.appendChild(square);
        }
        gamebox.appendChild(row);
    }
    generateCombos(num);
}

// Based on moves stored, write board
function write(player, positionXY, symbol) {
    let position = positionXY.toString();
    document.getElementById(position).innerHTML = symbol;

    updatePossibleMoves(positionXY);
};

function updatePossibleMoves(positionXY) {
    let index = possibleMoves.indexOf(positionXY);
    possibleMoves.splice(index, 1);
}

function receivePlayerInput(event) {
    event.preventDefault();
    
    const player = playerIdentity(turnCount); // Find out whose turn it is!
    playerContainer.innerHTML = player[2]; // Update box

    const boxPosition = event.target.id; // Retrieve box position of clicked element

    if (!validateInput(boxPosition)) {
        window.alert("This space is taken, sorry. Try again.");
        return;
    };

    if (result) {
        window.alert("This game is finished. Reset game.");
        return;
    }

    write(player[0], boxPosition, player[1]); // Write on board

    player[0].push(boxPosition); // Add to respective player object
    
    checkWin(player[0]);

    turnCount++; // Increase turn count

    if (computer) {
        computerPlay();
    }
};

// Check if last player won
function checkWin(player) {
    const playerCombo = player.sort();

    for (let i = 0; i < winningCombos.length; i++) {
        let compareArray = [];
        for (let j = 0; j< winningCombos[i].length; j++) {
            if (playerCombo.includes(winningCombos[i][j])) {
                compareArray.push(winningCombos[i][j]);
            }
        }
        if (arraysEqual(compareArray, winningCombos[i])) {
            window.alert("Congratulations " + currentPlayer);
            result = true;
            break;
        }
    }
    if (result == false && turnCount == size * size - 1) {
        window.alert("No one won. Reset game to try again.");
    }
};

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// Keep track of who has the move
function playerIdentity(turnCount) {
    if (turnCount % 2 === 0) {
        currentPlayer = 'Player One';
        return [playerOne, 'X', 'Player Two'];
    } else {
        currentPlayer = 'Player Two';
        return [playerTwo, 'O', 'Player One'];
    }
};

function computerPlay() {
    let computerIndex;
    let boxPosition;

    if (playerTwo.length < 1) {
        computerIndex = Math.floor(Math.random() * possibleMoves.length);
        boxPosition = possibleMoves[computerIndex];
    } else {
        let bestArray = [];
        for (let k = 0; k < possibleMoves.length; k++) {
            for (let a = 0; a < playerTwo.length; a++) {
                for (let i = 0; i < winningCombos.length; i++) {
                    if (winningCombos[i].includes(playerTwo[a]) && winningCombos[i].includes(possibleMoves[k])) {
                        boxPosition = possibleMoves[k];
                        break;
                    } else if (winningCombos[i].includes(possibleMoves[k])) {
                        bestArray.push(possibleMoves[k]);
                    }
                }
            }
        }
        computerIndex = Math.floor(Math.random() * bestArray.length);
        boxPosition = bestArray[computerIndex];
    }

    playerContainer.innerHTML = 'Player One'; // Update box    
    currentPlayer = 'Computer';
    write(playerTwo, boxPosition, 'O'); // Write on board
    playerTwo.push(boxPosition); // Add to respective player object
    checkWin(playerTwo);
    turnCount++;
}

function reset() {
    playerOne = [];
    playerTwo = [];
    winningCombos = [];
    possibleMoves = [];
    turnCount = 0;
    result = false;
    computer = false;
    gameStartForm.elements["computer"].checked = false;

    gamebox.innerHTML = '';

    // Reveal Game Options  
    intro.classList.remove('hidden');

    // Hide Gamebox
    gamebox.classList.add('hidden');
    turnContainer.classList.add('hidden');
    resetContainer.classList.add('hidden');
}

// Validate move by player
function validateInput(position) {
    if (playerOne.includes(position) || playerTwo.includes(position)) {
        return false;
    } else {
        return true;
    }
}

gameStartForm.onsubmit = startGame;
gamebox.onclick = receivePlayerInput;
resetButton.onclick = reset;
