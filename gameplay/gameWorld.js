import { Cell } from './cell.js';
import { createCell } from './cell.js';

export class GameWorld {

    constructor(canvas, gridSize, cellSize) {
        this.startListener = null;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.kernel = cellSize;
        this.numCellsPerSide = gridSize / this.kernel;
        this.clicked = {};
        this.gameObjects = [];
        this.normalizeScale();
    }

    updateDimensions(gridSize, cellSize) {
        this.clicked = {};
        this.gameObjects = [];
        this.kernel = cellSize;
        this.numCellsPerSide = gridSize / this.kernel;
        this.normalizeScale();
    }

    normalizeScale() {
        const { devicePixelRatio: pixelRatio } = window;

        if (pixelRatio > 1) {
            const numCellsPerSide = this.numCellsPerSide * this.kernel;
    
            this.canvas.width = numCellsPerSide * pixelRatio;
            this.canvas.height = numCellsPerSide * pixelRatio;
            this.canvas.style.width = `${numCellsPerSide}px`;
            this.canvas.style.height = `${numCellsPerSide}px`;
            this.context.scale(pixelRatio, pixelRatio);
        }
    }

    addStartButtonListener() {
        this.startListener = this.canvas.addEventListener('mouseup', this.clickListener);
    }

    removeStartButtonListener() {
        this.canvas.removeEventListener('mouseup', this.clickListener);
    }

    clickListener = (e) => {
        let z = window.getComputedStyle(canvas).zoom || 1;
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / z;
        const y = (e.clientY - rect.top) / z;

        const indexes = this.calculateIndexes({x,y});
        const cell = `${indexes.x}:${indexes.y}`;
    
        if (this.clicked[cell] === undefined) {
            this.clicked[cell] = createCell(indexes.x, indexes.y);
        } else {
            delete this.clicked[cell];
        }
    
        this.clearCanvas();
        this.createGrid();
        this.createPopulation({random: false});
        this.drawPopulation();
    }
    // Calculating the index from canvas coordinates
    calculateIndexes(path) {
        const indexes = {
            x: Math.floor(path.x / this.kernel),
            y: Math.floor(path.y / this.kernel)
        }
        return indexes;
    }

    createPopulation({random}) {
        this.gameObjects = [];
        const width = this.numCellsPerSide;
        for (let y = 0; y < width; y++) {
            for (let x = 0; x < width; x++) {
                const alive = random ? Math.random() > 0.5 : !!this.clicked[`${x}:${y}`];
                this.gameObjects.push(new Cell(this.context, x, y, alive, this.kernel));
            }
        }
    }

    createGrid() {
        const numCellsPerSide = this.numCellsPerSide * this.kernel; // Учитываем размер клеток
        this.context.strokeStyle = "rgba(0,0,0, 0.4)";
        for (let i = 0; i <= numCellsPerSide; i += this.kernel) {
            this.context.beginPath();
            this.context.moveTo(i, 0);
            this.context.lineTo(i, numCellsPerSide);
            this.context.stroke();
    
            this.context.beginPath();
            this.context.moveTo(0, i);
            this.context.lineTo(numCellsPerSide, i);
            this.context.stroke();
        }
    }

    clearCanvas() {
        const numCellsPerSide = this.numCellsPerSide;
        this.context.clearRect(0, 0, numCellsPerSide * this.kernel, numCellsPerSide * this.kernel);
    }

    isAlive(x, y) {
        const numCellsPerSide = this.numCellsPerSide;

        x = this.returnToField(x, numCellsPerSide);
        y = this.returnToField(y, numCellsPerSide);

        const index = this.gridToIndex(x, y);

        return this.gameObjects[index]?.alive ? 1 : 0;
    }

    returnToField(pos, rows) {
        return (pos + rows) % rows;
    }

    gridToIndex(x, y){
        return x + (y * this.numCellsPerSide);
    }

    drawPopulation() {
        for (const cell of this.gameObjects) {
            cell.draw();
        }
    }

    calculatePopulation () {
        if (!this.gameObjects.length) {
            this.createPopulation({ random: true });
        }
        // Loop through all cells
        const numCellsPerSide = this.numCellsPerSide;
        for (let x = 0; x < numCellsPerSide; x++) {
            for (let y = 0; y < numCellsPerSide; y++) {

                // calculating alive neighbors
                const underX = x - 1;
                const underY = y - 1;
                const upperX = x + 1;
                const upperY = y + 1;

                const numAlive = this.isAlive(underX, underY) + this.isAlive(x, underY) + this.isAlive(upperX, underY) + this.isAlive(underX, y) + this.isAlive(upperX, y) + this.isAlive(underX, upperY) + this.isAlive(x, upperY) + this.isAlive(upperX, upperY);
                const centerIndex = this.gridToIndex(x, y);
                const currentCell = this.gameObjects[centerIndex];
                
                if (numAlive === 2) {
                    // Nothing
                    currentCell.nextAlive = currentCell.alive;
                } else if (numAlive === 3) {
                    // Making it alive
                    currentCell.nextAlive = true;
                } else {
                    // Making it dead
                    currentCell.nextAlive = false;
                }
            }
        }
    
        for (const cell of this.gameObjects) {
            cell.alive = cell.nextAlive;
            // cell.draw() for lil bit more fps uncomment this row and comment the drawPopulation method in loop in main.js
        }
    }
}    