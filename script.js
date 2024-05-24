const menuScreen = document.getElementById('menuScreen')
const gameScreen = document.getElementById('gameScreen')
const documentScreen = document.getElementById('documentScreen')

const gameStartBtn = document.getElementById('gameStart')
gameStartBtn.addEventListener("click", function () {
  gameScreenDisplay();
  gameInit();
  document.getElementById('sound').play();
})

const gameContinueBtn = document.getElementById('gameContinue')
gameContinueBtn.addEventListener("click", function () {
  if (game.isNewGame) gameInit();
  game.run();
  gameScreenDisplay();
})

const gameDocumentBtn = document.getElementById('gameDocument')
gameDocumentBtn.addEventListener('click', function () {
  documentScreenDisplay();
})

const gameContainer = document.getElementById('game-container');

const flagIcon = document.getElementById('flagIcon');
flagIcon.addEventListener("click", function () {
  game.setCursorToFlag(true)
})

const pointerIcon = document.getElementById('pointerIcon')
pointerIcon.addEventListener('click', function () {
  game.setCursorToFlag(false)
})

const exitIcon = document.getElementById('exitIcon')
exitIcon.addEventListener('click', function () {
  game.stop();
  menuScreenDisplay();
})

const yesBtn = document.getElementById('yesButton');
yesBtn.addEventListener('click', function () {
  gameScreenDisplay();
  gameInit();
})
const noBtn = document.getElementById('noButton');
noBtn.addEventListener('click', function () {
  menuScreenDisplay();
})


const GRID_SIZE = 15;
const NUM_MINES = 25;

const DEBUG = true;

let game = {
  isInit: false,
  isNewGame: true,
  isRunning: false,
  isFlag: false,
  cellOpened: 0,
  rightFlag: 0,
  board: [],

  gameBoardInit: function () {
    for (let i = 0; i < GRID_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        this.board[i][j] = {
          isMine: false,
          isRevealed: false,
          isFlag: false,
          neighborCount: 0
        };
      }
    }
  },

  gameMineInit: function () {
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (!game.board[x][y].isMine) {
        game.board[x][y].isMine = true;
        this.board[x][y].neighborCount = -1;
        minesPlaced++;
        for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, GRID_SIZE - 1); i++) {
          for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, GRID_SIZE - 1); j++) {
            this.board[i][j].neighborCount++;
          }
        }
      }
    }
  },

  gameCellInit: function () {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const cell = document.createElement('div');
        if (DEBUG) cell.innerText = (this.board[i][j].isMine) ? "x" : this.board[i][j].neighborCount;
        cell.className = 'cell';
        cell.id = `${i}-${j}`;
        cell.addEventListener('click', handleClick);
        document.getElementById('game-container').appendChild(cell);
      }
    }
  },

  init: function () {
    this.gameBoardInit();
    this.gameMineInit();
    this.gameCellInit();
    this.setCursorToFlag();
    this.isNewGame = false;
  },

  run: function () {
    this.isRunning = true;
  },

  stop: function () {
    this.isRunning = false;
  },

  setCursorToFlag: function (boolean) {
    game.isFlag = boolean;
    if (game.isFlag) {
      gameContainer.classList.add('flag-cursor');
      gameContainer.classList.remove('pointer-cursor');
      return;
    }
    if (!game.isFlag) {
      gameContainer.classList.remove('flag-cursor');
      gameContainer.classList.add('pointer-cursor');
      return;
    }
  }
}

function handleClick(event) {
  const cell = event.target;
  const [x, y] = cell.id.split('-').map(Number);
  console.log(x + '-' + y)
  revealCell(x, y);
}

function menuScreenDisplay() {
  menuScreen.style.display = 'flex'
  gameScreen.style.display = 'none'
  documentScreen.style.display = 'none'
}

function gameScreenDisplay() {
  menuScreen.style.display = 'none'
  gameScreen.style.display = 'block'
  documentScreen.style.display = 'none'
  document.getElementById('gameToolBars').style.display = 'flex';
  document.getElementById('alert').style.display = 'none';
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
  game.init();
  game.run();
  clearInterval(timeCount);
  startTimer();
}

let timeCount;

function startTimer() {
  let seconds = 0;
  let minutes = 0;
  const timerElement = document.getElementById('timeCount');
  timerElement.innerText = timeToString();

  function updateTimer() {
    if (game.isRunning) {
      seconds++;
      if (seconds == 60) {
        minutes++;
        seconds = 0;
      }
      timerElement.innerText = timeToString();
    }
  }

  function timeToString() {
    let str = "";
    str = str + ((minutes < 10) ? "0" + minutes : + minutes) + ":";
    str = str + ((seconds < 10) ? "0" + seconds : + seconds);
    return str;
  }

  timeCount = setInterval(updateTimer, 1000);
}

function revealCell(x, y) {
  console.log(game.board[x][y])
  if (!game.isRunning) return;
  if (game.board[x][y].isRevealed) return;

  const cell = document.getElementById(`${x}-${y}`);
  if (game.isFlag) {
    game.board[x][y].isFlag = !game.board[x][y].isFlag;
    cell.classList.toggle("flagCell");

    if (game.board[x][y].isMine)
      game.rightFlag += (game.board[x][y].isFlag) ? 1 : -1;
    if (game.rightFlag == 25) win();
    return;
  }
  if (!game.isFlag) {
    if (game.board[x][y].isFlag) return;
    if (game.board[x][y].isMine) {
      defeat();
      return;
    }
  }
  game.cellOpened++;
  game.board[x][y].isRevealed = true;
  mineCount = game.board[x][y].neighborCount
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
  if (game.cellOpened == 200) win();
}

function revealAllMineCell() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (game.board[x][y].isMine) {
        const cell = document.getElementById(`${x}-${y}`);
        cell.classList.add('toolbar-icon')
        cell.classList.add('mine')
      }
    }
  }
}

function win() {
  game.isNewGame = true;
  document.getElementById('sound2').play();
  revealAllMineCell();
  document.getElementById('gameToolBars').style.display = 'none';
  document.getElementById('alert').style.display = 'flex';
  document.getElementById('win').style.display = 'block';
  document.getElementById('defeat').style.display = 'none';
  game.stop();
}

function defeat() {
  game.isNewGame = true;
  revealAllMineCell();
  document.getElementById('gameToolBars').style.display = 'none';
  document.getElementById('alert').style.display = 'flex';
  document.getElementById('defeat').style.display = 'block';
  document.getElementById('win').style.display = 'none';
  game.stop();
}