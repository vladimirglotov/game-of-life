import { Drawer } from "./dom/drawer.js"
import { World } from "./gameplay/world.js"
import { initialSettings } from './config.js'

const settings = {
	gridWidthMultiplier: 10,
	timeFrameMultiplier: 0,
	interval: false
}

let world
let drawer = new Drawer(initialSettings.gridWidth * settings.gridWidthMultiplier || initialSettings.gridWidth)
const startButton = document.getElementById('start')
const speed = document.getElementById('speed')
const countOfCells = document.getElementById('countOfCells')

drawer.drawGrid()
drawer.addListener()
startButton.addEventListener('click',startListener)

speed.addEventListener('change', function(event) {
	settings.timeFrameMultiplier = event.target.value
})
countOfCells.addEventListener('change', function(event) {
	settings.gridWidthMultiplier = event.target.value
	createNewDrawer()
})

function createNewDrawer() {
	drawer.reset({grid: true})
	drawer.removeListener()
	drawer = new Drawer(initialSettings.gridWidth * settings.gridWidthMultiplier)
	drawer.addListener()
	drawer.drawGrid()
}


function startListener() {
	drawer.removeListener()
	world = new World(drawer.rows, drawer.columns, drawer.population)

	gameLoop(initialSettings.timeFrame * settings.timeFrameMultiplier)
	
	speed.setAttribute("disabled", "disabled")
	countOfCells.setAttribute("disabled", "disabled")
	startButton.setAttribute("disabled", "disabled")
}	


function liveGeneration() {
	drawer.reset({ grid: true })
	drawer.drawWorld(world)
	world.evolve()
}

function gameLoop() {
	if (settings.timeFrameMultiplier) {

		liveGeneration()
		setInterval(() => {
			liveGeneration()
		}, initialSettings.timeFrame * settings.timeFrameMultiplier)

	} else {

		liveGeneration()
		setTimeout(() =>  {
			window.requestAnimationFrame(gameLoop),
			4 // minimal value for html5
		});
	}
};
