export class Cell {
	
	constructor (context, gridX, gridY, alive, cellSize) {
		this.context = context;
		this.cellSize = cellSize;
		
		this.gridX = gridX;
		this.gridY = gridY;
		
		this.alive = alive;
	}

	draw() {
		if (this.alive) {
			const cellSize = this.cellSize;
			this.context.fillStyle = '#ff8080';
			this.context.fillRect(this.gridX * cellSize, this.gridY * cellSize, cellSize, cellSize);
		}
	}
}

export function createCell(x, y) {
	return { x, y };
}