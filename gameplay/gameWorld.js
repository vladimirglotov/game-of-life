import { Cell } from './cell.js';
import { createCell } from './cell.js';

export class GameWorld {
    constructor(canvas, gridSize, cellSize) {
        this.startListener = null;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.width = gridSize;
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
            const width = this.width;
            this.canvas.width = width * pixelRatio;
            this.canvas.height = width * pixelRatio;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${width}px`;
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
        let z = window.getComputedStyle(this.canvas).zoom || 1;
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / z;
        const y = (e.clientY - rect.top) / z;

        const indexes = this.calculateIndexes({ x, y });
        const cell = `${indexes.x}:${indexes.y}`;

        if (this.clicked[cell] === undefined) {
            this.clicked[cell] = createCell(indexes.x, indexes.y);
        } else {
            delete this.clicked[cell];
        }

        this.clearCanvas();
        this.createGrid();
        this.createPopulation({ random: false });
        this.drawPopulation();
    }

    calculateIndexes(path) {
        const kernel = this.kernel;

        return {
            x: Math.floor(path.x / kernel),
            y: Math.floor(path.y / kernel)
        };
    }

    createPopulation({ random }) {
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
        const width = this.width;
        this.context.strokeStyle = "rgba(0,0,0, 0.4)";

        for (let i = 0; i <= width; i += this.kernel) {
            this.context.beginPath();
            this.context.moveTo(i, 0);
            this.context.lineTo(i, width);
            this.context.stroke();
    
            this.context.beginPath();
            this.context.moveTo(0, i);
            this.context.lineTo(width, i);
            this.context.stroke();
        }
    }

    clearCanvas() {
        const width = this.width;
        this.context.clearRect(0, 0, width, width);
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

    gridToIndex(x, y) {
        return x + (y * this.numCellsPerSide);
    }

    drawPopulation() {
        for (const cell of this.gameObjects) {
            cell.draw();
        }
    }

    calculatePopulation () {
        const numCellsPerSide = this.numCellsPerSide;

        for (let x = 0; x < numCellsPerSide; x++) {
            for (let y = 0; y < numCellsPerSide; y++) {
    
                const underX = x - 1;
                const underY = y - 1;
                const upperX = x + 1;
                const upperY = y + 1;

                const numAlive = this.isAlive(underX, underY) + this.isAlive(x, underY) + this.isAlive(upperX, underY) + this.isAlive(underX, y) + this.isAlive(upperX, y) + this.isAlive(underX, upperY) + this.isAlive(x, upperY) + this.isAlive(upperX, upperY);
                const centerIndex = this.gridToIndex(x, y);
                const currentCell = this.gameObjects[centerIndex];

                if (numAlive === 2) {
                    currentCell.nextAlive = currentCell.alive;
                } else if (numAlive === 3) {
                    currentCell.nextAlive = true;
                } else {
                    currentCell.nextAlive = false;
                }
            }
        }

        for (const cell of this.gameObjects) {
            cell.alive = cell.nextAlive;
        }
    }
}
