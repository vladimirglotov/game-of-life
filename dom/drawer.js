import { createCell } from "../gameplay/cell.js";

export class Drawer {
    constructor(kernelSize) {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        const [width, height] = [canvas.offsetWidth, canvas.offsetHeight];
        this.context = context;
        this.kernel = kernelSize;

        this.width = width;
        this.height = height;

        this.rows = Math.floor(height / this.kernel);
        this.columns = Math.floor(width / this.kernel);
        this.normalizeScale();

        this.clicked = {}
    }
    get population() {
        return this.clicked
      }

    addListener = () => {
        canvas.addEventListener('mouseup', this.clickListener);
    }
    removeListener = () => {
        canvas.removeEventListener('mouseup', this.clickListener);
    }
    
    clickListener = (e) => {
        let z = window.getComputedStyle(canvas).zoom || 1;     
        const x = e.pageX/z - e.target.offsetLeft
        const y = e.pageY/z - e.target.offsetTop;

        const indexes = this.calculateIndexes({x,y})

        if (typeof this.clicked[`${indexes.x}:${indexes.y}`] === "undefined") {
            this.clicked[`${indexes.x}:${indexes.y}`] = createCell(indexes.x, indexes.y)
        } else {
            delete this.clicked[`${indexes.x}:${indexes.y}`]
        }
        this.reset({grid: true})
        this.drawPopulation()
    }

    calculateIndexes = (path) => {
        const indexes = {
            x: Math.floor(path.x / this.kernel),
            y: Math.floor(path.y / this.kernel)
        }
        return indexes
    }

    normalizeScale = () => {
        const { devicePixelRatio: pixelRatio } = window;

        if (pixelRatio > 1) {
        canvas.width = this.width * pixelRatio;
        canvas.height = this.height * pixelRatio;
        canvas.style.width = `${this.width}px`;
        canvas.style.height = `${this.height}px`;
        this.context.scale(pixelRatio, pixelRatio);
        }
    };

    drawRect = (cell) => {
        this.context.fillRect(
            cell.x * this.kernel,
            cell.y * this.kernel,
            this.kernel,
            this.kernel
        );
    }

    drawGrid = () => {
        this.context.strokeStyle = "rgba(0,0,0, 0.3)";
        for (let i = 0; i < this.width; i += this.kernel) {
        this.context.beginPath();
        this.context.moveTo(i, 0);
        this.context.lineTo(i, this.height);
        this.context.stroke();
        }

        for (let j = 0; j < this.height; j += this.kernel) {
        this.context.beginPath();
        this.context.moveTo(0, j);
        this.context.lineTo(this.width, j);
        this.context.stroke();
        }
    };

    drawPopulation = () => {
        this.context.fillStyle = "#000000";
        Object.values(this.population).forEach((cell) => {
        this.drawRect(cell)
        });
    }

    drawWorld = (world) => {
        this.context.fillStyle = "#000000";
        world.cells.forEach((cell) => {
        this.drawRect(cell)
        });
    };

    reset = (settings = {}) => {
        const { grid = false } = settings;

        this.context.clearRect(0, 0, this.width, this.height);
        if (grid) this.drawGrid();
    };
}
