/**
 * Khai báo biến
 * 
 * 
 */

const gameContinueButton = document.getElementById('gameContinue')
const gameConfigButton = document.getElementById('gameConfig')
const gameStartButton = document.getElementById('gameStart')
const menuScreen = document.getElementById('menuScreen')
const gameContainer = document.getElementById('game-container');
const flagIcon = document.getElementById('flagIcon');
const pointerIcon = document.getElementById('pointerIcon')

const GRID_SIZE = 20;
const NUM_MINES = 50;

let board = [];

let isFlag = false;

/**
 * Thêm event vào game
 * 
 * 
 */
gameStartButton.addEventListener("click", function () {
  gameContainer.style.display = 'grid'
  menuScreen.style.display = 'none'
})

flagIcon.addEventListener("click", function(){
  isFlag = true;
})

pointerIcon.addEventListener('click',function(){
  isFlag=false
})

gameContainer.addEventListener('mouseover', function () {
  if (isFlag)
    gameContainer.classList.add('flag-cursor');
});

gameContainer.addEventListener('mouseleave', function () {
  gameContainer.classList.remove('flag-cursor');
});


/**
 * 
 * 
 * 
 */


function initializeBoard() {
  for (let i = 0; i < GRID_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      board[i][j] = {
        isMine: false,
        isRevealed: false,
        isFlag: false,
        neighborCount: 0
      };
    }
  }

  let minesPlaced = 0;
  while (minesPlaced < NUM_MINES) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }
}

function revealCell(x, y) {
  if (board[x][y].isRevealed) return;
  const cell = document.getElementById(`${x}-${y}`);
  if (board[x][y].isMine) {
    cell.classList.add('mine');
    gameContainer.removeEventListener('click', handleClick);
    alert('Bạn đã thua!');
  } else {
    board[x][y].isRevealed = true;
    const mineCount = calculateNeighborMines(x, y);
    console.log(mineCount)
    if (mineCount > 0) {
      cell.textContent = mineCount;
      cell.classList.add('hasCount');
    } else {
      cell.classList.add('notCount');
      for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, GRID_SIZE - 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, GRID_SIZE - 1); j++) {
          if (x !== i || y !== j) revealCell(i, j)
        }
      }
    }
  }
}

function calculateNeighborMines(x, y) {
  let count = 0;
  for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, GRID_SIZE - 1); i++) {
    for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, GRID_SIZE - 1); j++) {
      if (board[i][j].isMine) {
        count++;
      }
    }
  }
  return count;
}

function handleClick(event) {
  const cell = event.target;
  const [x, y] = cell.id.split('-').map(Number);
  revealCell(x, y);
}

function initializeGame() {
  initializeBoard();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;
      cell.addEventListener('click', handleClick);
      gameContainer.appendChild(cell);
    }
  }
}

initializeGame();
