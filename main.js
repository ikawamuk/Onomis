import { update } from "./game/core.js";
import { bindInput, bindStartButton } from "./game/input.js";
import { render } from "./game/render.js";

let lastFrameTime = 0;

function gameLoop(timestamp) {
	if (lastFrameTime === 0) {
		lastFrameTime = timestamp;
	}

	const deltaMs = timestamp - lastFrameTime;
	lastFrameTime = timestamp;

	update(deltaMs);
	render();

	requestAnimationFrame(gameLoop);
}

render();
bindStartButton();
bindInput();
requestAnimationFrame(gameLoop);
