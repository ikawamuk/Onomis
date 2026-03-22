import { GAME_STATE } from "./constants.js";
import { initGame, moveHorizontal } from "./core.js";
import { render } from "./render.js";
import { state } from "./state.js";

export function bindStartButton() {
  const startButton = document.querySelector("#startButton");
  if (!startButton) return;

  startButton.addEventListener("click", () => {
    initGame();
    render();
  });
}

export function bindInput() {
  document.addEventListener("keydown", (event) => {
    if (state.gameState !== GAME_STATE.PLAYING) return;

    const key = event.key.toLowerCase();
    if (key === "a") {
      moveHorizontal(-1);
    } else if (key === "d") {
      moveHorizontal(1);
    }
  });
}
