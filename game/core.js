import {
  COLS,
  GAME_STATE,
  LOCK_DELAY_MS,
  MAX_LOCK_RESETS,
  NATURAL_DROP_INTERVAL_MS,
  O_MINO_SHAPE,
  ROWS,
  SPAWN_X,
  SPAWN_Y
} from "./constants.js";
import { createEmptyBoard, state } from "./state.js";

export function canPlaceMino(minoX, minoY) {
  for (const cell of O_MINO_SHAPE) {
    const x = minoX + cell.x;
    const y = minoY + cell.y;

    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
      return false;
    }

    if (state.board[y][x] !== 0) {
      return false;
    }
  }

  return true;
}

export function isGrounded() {
  if (!state.currentMino) return false;
  return !canPlaceMino(state.currentMino.x, state.currentMino.y + 1);
}

export function spawnPiece() {
  const spawned = { x: SPAWN_X, y: SPAWN_Y, lockResetCount: 0 };

  if (!canPlaceMino(spawned.x, spawned.y)) {
    state.gameState = GAME_STATE.GAMEOVER;
    state.currentMino = null;
    return false;
  }

  state.currentMino = spawned;
  return true;
}

export function moveHorizontal(dx) {
  if (!state.currentMino) return;

  const nextX = state.currentMino.x + dx;
  if (!canPlaceMino(nextX, state.currentMino.y)) {
    return;
  }

  state.currentMino.x = nextX;

  if (isGrounded() && state.currentMino.lockResetCount < MAX_LOCK_RESETS) {
    state.lockTimer = 0;
    state.currentMino.lockResetCount += 1;
  }
}

export function softStep() {
  if (!state.currentMino) return false;

  const nextY = state.currentMino.y + 1;
  if (!canPlaceMino(state.currentMino.x, nextY)) {
    return false;
  }

  state.currentMino.y = nextY;
  state.lockTimer = 0;
  return true;
}

export function lockPiece() {
  if (!state.currentMino) return;

  for (const cell of O_MINO_SHAPE) {
    const x = state.currentMino.x + cell.x;
    const y = state.currentMino.y + cell.y;

    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
      continue;
    }

    state.board[y][x] = 1;
  }

  state.currentMino = null;
  state.lockTimer = 0;
  state.dropTimer = 0;
  state.canHold = true;
  spawnPiece();
}

export function initGame() {
  state.gameState = GAME_STATE.PLAYING;
  state.board = createEmptyBoard();
  state.currentMino = null;
  state.nextQueue = null;
  state.holdPiece = null;
  state.canHold = true;
  state.score = 0;
  state.dropTimer = 0;
  state.lockTimer = 0;

  spawnPiece();
}

export function update(deltaMs) {
  if (state.gameState !== GAME_STATE.PLAYING) return;
  if (!state.currentMino) return;

  if (isGrounded()) {
    state.lockTimer += deltaMs;
    if (state.lockTimer >= LOCK_DELAY_MS) {
      lockPiece();
    }
    return;
  }

  state.dropTimer += deltaMs;
  while (state.dropTimer >= NATURAL_DROP_INTERVAL_MS) {
    state.dropTimer -= NATURAL_DROP_INTERVAL_MS;
    const moved = softStep();
    if (!moved) {
      state.dropTimer = 0;
      break;
    }
  }
}
