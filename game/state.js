import { COLS, GAME_STATE, ROWS } from "./constants.js";

export function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export const state = {
  gameState: GAME_STATE.READY,
  board: createEmptyBoard(),
  currentMino: null,
  nextQueue: null,
  holdPiece: null,
  canHold: true,
  score: 0,
  dropTimer: 0,
  lockTimer: 0
};
