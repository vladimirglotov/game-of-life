export class Cell {
	static width = 1 // 1-100-1000
	static height = 1

	constructor (context, gridX, gridY, alive) {
		this.context = context

		// Позиция клетки
		this.gridX = gridX
		this.gridY = gridY

		// Живая или нет
		this.alive = alive
	}

	draw() {
		if (this.alive) {
			this.context.fillStyle = '#ff8080'
			this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height)
		}
	}
}

export function createCell(x, y) {
	return { x, y }
}