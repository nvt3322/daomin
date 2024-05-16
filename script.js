/**
 * Khai báo biến
 * 
 * 
 */

const menuScreen = document.getElementById('menuScreen')
const gameScreen = document.getElementById('gameScreen')
const gameContinueButton = document.getElementById('gameContinue')
const gameConfigButton = document.getElementById('gameConfig')
const gameStartButton = document.getElementById('gameStart')
const gameContainer = document.getElementById('game-container');
const flagIcon = document.getElementById('flagIcon');
const pointerIcon = document.getElementById('pointerIcon')
const exitIcon = document.getElementById('exitIcon')

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
  gameScreen.style.display = 'block'
  gameContainer.style.display = 'grid'
  menuScreen.style.display = 'none'
  gameInit();
})

gameContinueButton.addEventListener("click", function () {
  gameScreen.style.display = 'block'
  gameContainer.style.display = 'grid'
  menuScreen.style.display = 'none'
})

flagIcon.addEventListener("click", function () {
  isFlag = true;
})

pointerIcon.addEventListener('click', function () {
  isFlag = false
})

exitIcon.addEventListener('click', function () {
  gameScreen.style.display = 'none'
  menuScreen.style.display = 'block'
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
function gameInit() {
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  isFlag = false;

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
}

/**
 * Khi nhấn vào 1 ô trong màn hình sẽ xảy ra các trường hợp :
 * Nếu đang là con trỏ bình thường :
 *  - Khi nhấp vào 1 ô sẽ phải tính toán xem 9 ô xung quanh có ô nào có mìn hay không.
 *  ** TH1 : Không phải ô mìn
 *  -- Nếu có ( kết quả > 0 ) thì sẽ hiện số lên ô hiện tại
 *  -- Nếu không có ( kết quả = 0) thì sẽ đệ quy hàm tới 4 ô xung quanh ( trên dưới trái phải )
 *  ** TH2 : Ô mìn 
 *  -- Hiện thông báo thua cuộc.
 * 
 * Nếu đang là con trỏ flag :
 *  - Khi nhấn vào 1 ô thì sẽ gắn cờ lên đó.
 * 
 */

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
      cell.classList.add('countCell');
    } else {
      cell.classList.add('emptyCell');
      for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, GRID_SIZE - 1); i++) {
        for (let j = Math.max(0, y - 1); j <= Math.min(y + 1, GRID_SIZE - 1); j++) {
          if (x !== i || y !== j) revealCell(i, j)
        }
      }
    }
  }
  if (winConditionCheck) {
    alert('Bạn đã thắng');
    gameInit();
  }
}

function cellClick(){
  
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

function winConditionCheck(){
  return false;
}

function handleClick(event) {
  const cell = event.target;
  const [x, y] = cell.id.split('-').map(Number);
  revealCell(x, y);
}