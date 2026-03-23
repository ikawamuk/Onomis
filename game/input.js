import {
  GAME_STATE,
  KEY_REPEAT_DELAY_MS,
  KEY_REPEAT_INTERVAL_MS
} from "./constants.js";
import {
  holdCurrentMino,
  hardDrop,
  initGame,
  moveHorizontal,
  rotateCurrentMino,
  softStep
} from "./core.js";
import { render } from "./render.js";
import { state } from "./state.js";

const repeatHandles = new Map();

function startRepeat(key, action) {
  if (repeatHandles.has(key)) return;

  action();

  const timeoutId = window.setTimeout(() => {
    const intervalId = window.setInterval(() => {
      if (state.gameState !== GAME_STATE.PLAYING) return;
      action();
    }, KEY_REPEAT_INTERVAL_MS);

    repeatHandles.set(key, { timeoutId: null, intervalId });
  }, KEY_REPEAT_DELAY_MS);

  repeatHandles.set(key, { timeoutId, intervalId: null });
}

function stopRepeat(key) {
  const handles = repeatHandles.get(key);
  if (!handles) return;

  if (handles.timeoutId !== null) {
    window.clearTimeout(handles.timeoutId);
  }
  if (handles.intervalId !== null) {
    window.clearInterval(handles.intervalId);
  }

  repeatHandles.delete(key);
}

function stopAllRepeats() {
  for (const key of repeatHandles.keys()) {
    stopRepeat(key);
  }
}

export function bindStartButton() {
  const startButton = document.querySelector("#startButton");
  if (!startButton) return;

  startButton.addEventListener("click", () => {
    initGame();
    render();
  });
}

export function bindInput() {
  const repeatActions = {
    a: () => moveHorizontal(-1),
    d: () => moveHorizontal(1),
    s: () => softStep()
  };

  const oneShotActions = {
    " ": () => holdCurrentMino(),
    q: () => rotateCurrentMino(),
    e: () => rotateCurrentMino(),
    w: () => hardDrop()
  };

  document.addEventListener("keydown", (event) => {
    if (state.gameState !== GAME_STATE.PLAYING) return;

    const key = event.key.toLowerCase();
    const repeatAction = repeatActions[key];
    const oneShotAction = oneShotActions[key];

    if (repeatAction) {
      // OS側のリピートは無視して、ゲーム内リピートを使う
      if (event.repeat) {
        return;
      }

      startRepeat(key, repeatAction);
      return;
    }

    if (!oneShotAction) return;

    if (event.repeat) {
      return;
    }

    oneShotAction();
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (!repeatActions[key]) return;

    stopRepeat(key);
  });

  // フォーカス外れ時に押しっぱなし状態を確実に解除
  window.addEventListener("blur", stopAllRepeats);
}
