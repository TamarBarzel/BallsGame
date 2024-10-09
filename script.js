const gameBoard = document.getElementById('game-board');
const cells = [];
let counterRemainBalls = 0;
let gameStarted = false;
let playerPosition = null;
const wallCells = [];
const portalCells = {
    top: 5,
    bottom: 113,
    left: 60,
    right: 71
}

function createBoard() {
    for (let i = 0; i < 120; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i; // שמירת אינדקס התאים
        gameBoard.appendChild(cell);

        if (i < 12 || i >= 108 || i % 12 === 0 || i % 12 === 11) {
            if (i === portalCells.top || i === portalCells.bottom || i === portalCells.left || i === portalCells.right) {
                cell.classList.add('portal');
            }
            else {
                cell.classList.add('wall'); 
                wallCells.push(i);   // שמירת אינדקס הקיר
            }
        }

        cells.push(cell);
        console.log(gameStarted);
    }
}

function createBall() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.textContent = '⚽';
    return ball;
}

function addBall() {
    const emptyCells = cells.filter(item => !item.hasChildNodes() && !item.classList.contains('wall'));
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cell = emptyCells[randomIndex];
        const ball = createBall();
        cell.appendChild(ball);


        counterRemainBalls++;
        if (!gameStarted) {  
            gameStarted = true;  
        }
        
        // console.log(counterRemainBalls);

    }
}


function createPlayer() {
    const emptyCells = cells.filter(item => !item.hasChildNodes() && !item.classList.contains('wall'));
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    playerPosition = parseInt(emptyCells[randomIndex].dataset.index);
    const cell = cells[playerPosition];

    const player = document.createElement('div');
    player.classList.add('player');
    player.textContent = '😁';
    cell.appendChild(player);
}

function movePlayer(direction) {
    if (playerPosition === null) return;
    let newPosition = playerPosition;

    switch (direction) {
        case 'up':
            if (newPosition === portalCells.top) {
                newPosition = portalCells.bottom;
            } else if (newPosition - 12 >= 0) newPosition -= 12;
            break;
        case 'down':
            if (newPosition === portalCells.bottom) {
                newPosition = portalCells.top;
            } else if (newPosition + 12 < 120) {
                newPosition += 12;
            }
            break;
        case 'left':
            if (newPosition === portalCells.left) {
                newPosition = portalCells.right;
            } else if (newPosition % 12 !== 0) {
                newPosition -= 1;
            }
            break;
        case 'right':
            if (newPosition === portalCells.right) {
                newPosition = portalCells.left;
            } else if (newPosition % 12 !== 11) {
                newPosition += 1;
            }
            break;
    }
    if (wallCells.includes(newPosition)) return;

    if (cells[newPosition].querySelector('.ball')) {
        cells[newPosition].innerHTML = '';
        counterRemainBalls--;
        console.log(counterRemainBalls);

    }

    cells[playerPosition].innerHTML = '';
    playerPosition = newPosition;

    const player = document.createElement('div');
    player.classList.add('player');
    player.textContent = '😁';
    cells[playerPosition].appendChild(player);

    checkWinLooseGame();
}
function resetGame() {
    location.reload();
}

let gameWon = false;

function checkWinLooseGame() {
    if (gameStarted && counterRemainBalls == 0 && !gameWon) {
        gameWon = true; 
        setTimeout(() => {
            alert('You won!');
            resetGame();
        }, 500);
    }
}



document.addEventListener('keydown', function (event) {


    switch (event.key) {
        case 'ArrowUp':
            movePlayer('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowRight':
            movePlayer('right');
            break;
    }
});



document.getElementById('reset-button').addEventListener('click', resetGame);

createBoard();
createPlayer();
setInterval(addBall, 4000);
