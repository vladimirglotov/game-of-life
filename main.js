
import { GameWorld } from './gameplay/gameWorld.js'

const settings = {
	gridWidth: 1, // 1-100-1000
}

let gameWorld
const startButton = document.getElementById('start')

startButton.addEventListener('click',gameLoop)


function gameLoop() {
	let time = performance.now()

	gameWorld.checkSurrounding()
	gameWorld.clearField()
	gameWorld.createGrid()
	gameWorld.drawWorld()

	time = performance.now() - time
	console.log('Время выполнения = ', time)

	setTimeout( () => {
		window.requestAnimationFrame(() => gameLoop())
	}, 4)
}

function start() {
	gameWorld = new GameWorld('canvas', settings.gridWidth)
	gameWorld.createGrid()
	gameWorld.addListener()
}

start()

