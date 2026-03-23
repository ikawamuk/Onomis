export const ROWS = 20;
export const COLS = 10;

export const O_MINO_SHAPE = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
];

export const SPAWN_X = Math.floor(COLS / 2) - 1;
export const SPAWN_Y = 0;
export const NATURAL_DROP_INTERVAL_MS = 700;
export const KEY_REPEAT_DELAY_MS = 150;
export const KEY_REPEAT_INTERVAL_MS = 50;
export const LOCK_DELAY_MS = 500;
export const LINE_CLEAR_DELAY_MS = 100;
export const MAX_LOCK_RESETS = 15;

export const GAME_STATE = Object.freeze({
  READY: "ready",
  PLAYING: "playing",
  GAMEOVER: "gameover"
});
