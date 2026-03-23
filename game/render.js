import { COLS, GAME_STATE, O_MINO_SHAPE, ROWS } from "./constants.js";
import { state } from "./state.js";

export function isCurrentMinoCell(x, y) {
  if (!state.currentMino) return false;

  for (const cell of O_MINO_SHAPE) {
    if (state.currentMino.x + cell.x === x && state.currentMino.y + cell.y === y) {
      return true;
    }
  }

  return false;
}

export function syncStartButton() {
  const startButton = document.querySelector("#startButton");
  if (!startButton) return;

  if (state.gameState === GAME_STATE.PLAYING) {
    startButton.style.display = "none";
    return;
  }

  startButton.style.display = "inline-block";
  startButton.textContent =
    state.gameState === GAME_STATE.GAMEOVER ? "RESTART" : "START";
}

function syncHoldPreview() {
  const holdPreviewEl = document.querySelector(".left-panel .preview-box");
  if (!holdPreviewEl) return;

  holdPreviewEl.innerHTML = "";
  if (!state.holdPiece) {
    return;
  }

  const omino = document.createElement("div");
  omino.className = "omino";
  holdPreviewEl.appendChild(omino);
}

export function render() {
  const fieldEl = document.querySelector(".field");
  const scoreEl = document.querySelector(".score-box");
  if (!fieldEl) return;

  const clearingRows = new Set(state.lineClearRows);

  fieldEl.innerHTML = "";
  fieldEl.style.display = "grid";
  fieldEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  fieldEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

  const fragment = document.createDocumentFragment();
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const cell = document.createElement("div");
      const isClearingRow = clearingRows.has(y);
      const occupied = state.board[y][x] === 1 || isCurrentMinoCell(x, y);
      cell.style.border = "1px solid #313131";
      cell.style.backgroundColor = isClearingRow
        ? "#fff2a8"
        : occupied
          ? "#ffd400"
          : "#1a1a1a";
      fragment.appendChild(cell);
    }
  }

  fieldEl.appendChild(fragment);

  if (scoreEl) {
    scoreEl.textContent = String(state.score).padStart(6, "0");
  }

  syncHoldPreview();
  syncStartButton();
}
