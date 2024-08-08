import { GameWorld } from './gameplay/gameWorld.js';

let gameWorld = null;
let gridSize = 500;
let cellSize = 10;
let animationFrameId = null;

const fps = 30;
let interval = 1000 / fps;
let lastTime = 0;


const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const fpsSelect = document.getElementById('speed');
const countOfCellsSelect = document.getElementById('countOfCells');
const sizeOfCellSelect = document.getElementById('sizeOfCell');
const canvas = document.getElementById('canvas');

fpsSelect.addEventListener('change', () => updateGrid());
countOfCellsSelect.addEventListener('change', () => updateGrid(true));
sizeOfCellSelect.addEventListener('change', () => updateGrid(true));
startButton.addEventListener('click', start);
resetButton.addEventListener('click', reset);

function updateGrid(needToReset = false) {
    const fpsValue = 1000 / parseInt(fpsSelect.value, 10) || 30;

    gridSize = parseInt(countOfCellsSelect.value, 10) || 500;
    cellSize = parseInt(sizeOfCellSelect.value, 10) || 10;
	interval = Number.isFinite(fpsValue) ? fpsValue : 0;

	needToReset && reset();
}

function gameLoop(timestamp) {
	if (timestamp - lastTime >= interval) {
		lastTime = timestamp;
		
		gameWorld.clearCanvas();
		gameWorld.calculatePopulation();
		gameWorld.createGrid();
		gameWorld.drawPopulation();
	}

	animationFrameId = requestAnimationFrame(gameLoop);
}

function start() {
	gameWorld.removeStartButtonListener();
	[startButton.disabled, resetButton.disabled] = [resetButton.disabled, startButton.disabled];
	gameLoop();
}

function reset() {
	cancelAnimationFrame(animationFrameId);
	animationFrameId = null;
	gameWorld.clearCanvas();
	if (startButton.disabled) {
		[startButton.disabled, resetButton.disabled] = [resetButton.disabled, startButton.disabled];
	}
	init();
}

function init() {
	gameWorld = new GameWorld(canvas, gridSize, cellSize);

	gameWorld.createGrid();
	gameWorld.addStartButtonListener();
}

init();
