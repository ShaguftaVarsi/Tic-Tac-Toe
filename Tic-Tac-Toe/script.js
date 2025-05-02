// ---------------- state & elements ----------------
const boardEl     = document.getElementById("board");
const statusEl    = document.getElementById("status");
const resetBtn    = document.getElementById("resetBtn");

const endScreen   = document.getElementById("endScreen");
const resultText  = document.getElementById("resultText");
const playAgainBtn= document.getElementById("playAgainBtn");
const winSound    = document.getElementById("winSound");

let board, currentPlayer, gameOver;

// create 9 squares
function initBoard() {
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const sq = document.createElement("div");
    sq.className = "square";
    sq.dataset.index = i;
    boardEl.appendChild(sq);
  }
}

function newGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusEl.textContent = `Player ${currentPlayer}’s turn`;
  Array.from(boardEl.children).forEach(sq => (sq.textContent = ""));
  endScreen.classList.add("hidden");
}

initBoard();
newGame();

// ---------------- helpers ----------------
const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function hasWon() {
  return wins.some(c => c.every(i => board[i] === currentPlayer));
}
function isDraw() { return board.every(Boolean); }

// ---------------- UI: end screen ----------------
function showEndScreen(message, isWin = false) {
  resultText.textContent = message;
  endScreen.classList.remove("hidden");

  if (isWin) {
    // SFX
    winSound.currentTime = 0;
    winSound.play().catch(()=>{});

    // Confetti for ~1 s
    const duration = 200, end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 50, startVelocity: 40, spread: 70, origin:{y:0.6}});
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

// ---------------- event handling ----------------
boardEl.addEventListener("click", e => {
  const sq = e.target;
  if (!sq.classList.contains("square") || gameOver) return;

  const idx = sq.dataset.index;
  if (board[idx]) return;

  board[idx] = currentPlayer;
  sq.textContent = currentPlayer;

  if (hasWon()) {
    gameOver = true;
    showEndScreen(`Player ${currentPlayer} wins! 🎉`, true);
  } else if (isDraw()) {
    gameOver = true;
    showEndScreen("It’s a draw! 🤝");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = `Player ${currentPlayer}’s turn`;
  }
});

resetBtn.addEventListener("click", newGame);
playAgainBtn.addEventListener("click", newGame);
