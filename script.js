const menuScreen = document.getElementById('menuScreen')
const gameScreen = document.getElementById('gameScreen')
const documentScreen = document.getElementById('documentScreen')

const gameStartBtn = document.getElementById('gameStart')
gameStartBtn.addEventListener("click", function () {
  gameScreenDisplay();
  gameInit();
})
const gameContinueBtn = document.getElementById('gameContinue')
gameContinueBtn.addEventListener("click", function () {
  gameScreenDisplay();
})

const gameDocumentBtn = document.getElementById('gameDocument')
gameDocumentBtn.addEventListener('click', function () {
  documentScreenDisplay();
})

const gameContainer = document.getElementById('game-container');
const flagIcon = document.getElementById('flagIcon');
const pointerIcon = document.getElementById('pointerIcon')
const exitIcon = document.getElementById('exitIcon')

const GRID_SIZE = 15;
const NUM_MINES = 25;

let cellOpened = 0;

let board = [];

let isFlag = false;

flagIcon.addEventListener("click", function () {
  isFlag = true;
  gameContainer.classList.add('flag-cursor');
})

pointerIcon.addEventListener('click', function () {
  isFlag = false;
  gameContainer.classList.remove('flag-cursor');
})

exitIcon.addEventListener('click', function () {
  menuScreenDisplay();
})

function menuScreenDisplay() {
  menuScreen.style.display = 'flex'
  gameScreen.style.display = 'none'
  documentScreen.style.display = 'none'
}

function gameScreenDisplay() {
  menuScreen.style.display = 'none'
  gameScreen.style.display = 'block'
  documentScreen.style.display = 'none'
}

function documentScreenDisplay() {
  menuScreen.style.display = 'none'
  gameScreen.style.display = 'none'
  documentScreen.style.display = 'flex'
}

function gameInit() {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  clearInterval(timeCount);
  isFlag = false;
  cellOpened = 0;

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

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;
      cell.addEventListener('click', handleClick);
      gameContainer.appendChild(cell);
    }
  }
  startTimer();
}

let timeCount;

function startTimer() {
  let seconds = 0;
  const timerElement = document.getElementById('timeCount');

  function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = [
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');

    timerElement.textContent = formattedTime;
  }

  timeCount = setInterval(updateTimer, 1000);
}

function handleClick(event) {
  const cell = event.target;
  const [x, y] = cell.id.split('-').map(Number);
  revealCell(x, y);
}

function revealCell(x, y) {
  if (board[x][y].isRevealed) return;

  const cell = document.getElementById(`${x}-${y}`);
  if (isFlag) {
    board[x][y].isFlag = !board[x][y].isFlag;
    if (board[x][y].isFlag) cell.classList.add('flagCell')
    else cell.classList.remove('flagCell');
    return;
  }
  if (board[x][y].isFlag) return;
  if (board[x][y].isMine) {
    defeat();
    alert('Bạn đã thua!');
    //gameInit();
    return;
  }
  cellOpened++;
  board[x][y].isRevealed = true;
  const mineCount = calculateNeighborMines(x, y);
  if (mineCount > 0) {
    cell.textContent = mineCount;
    cell.classList.add('countCell');
  } else {
    cell.classList.add('emptyCell');
    for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, GRID_SIZE - 1); i++) {
      for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, GRID_SIZE - 1); j++) {
        if (x !== i || y !== j) revealCell(i, j)
      }
    }
  }

  if (cellOpened == 200) {
    alert('Bạn đã thắng');
    gameInit();
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

function win() {
  return false;
}

function defeat() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {     
      if (board[x][y].isMine) {
        const cell = document.getElementById(`${x}-${y}`);
        cell.classList.add('toolbar-icon')
        cell.classList.add('mine')
      }
    }
  }
}