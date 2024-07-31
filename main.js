import { GameWorld } from './gameplay/gameWorld.js';

let gameWorld = null;
let gridSize = 100;
let cellSize = 10;
let animationFrameId = null;


const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const countOfCellsSelect = document.getElementById('countOfCells');
const sizeOfCellSelect = document.getElementById('sizeOfCell');
const canvas = document.getElementById('canvas');

countOfCellsSelect.addEventListener('change', updateGrid);
sizeOfCellSelect.addEventListener('change', updateGrid);
startButton.addEventListener('click', start);
resetButton.addEventListener('click', reset);

function updateGrid() {
    gridSize = parseInt(countOfCellsSelect.value, 10);
    cellSize = parseInt(sizeOfCellSelect.value, 10);
	reset();
}

function gameLoop() {
	gameWorld.clearCanvas();
	gameWorld.calculatePopulation();
	gameWorld.createGrid();
	gameWorld.drawPopulation();

	animationFrameId = window.requestAnimationFrame(gameLoop);
}

function start() {
	gameWorld.removeStartButtonListener();
	[startButton.disabled, resetButton.disabled] = [resetButton.disabled, startButton.disabled];
	gameLoop();
}

function reset() {
	window.cancelAnimationFrame(animationFrameId);
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
