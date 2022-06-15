import { Cell } from './cell.js'
import { createCell } from './cell.js'

export class GameWorld {

    static numColumns = 1000; // 1-100-1000
    static numRows = 1000;

    constructor(canvasId, kernel) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        const [width, height] = [canvas.offsetWidth, canvas.offsetHeight]
        this.clicked = {}
        this.gameObjects = [];
        this.width = width
        this.height = height
        this.kernel = kernel
        this.normalizeScale()
    }
    // Улучшаем отображение
    normalizeScale = () => {
        const { devicePixelRatio: pixelRatio } = window

        if (pixelRatio > 1) {
            canvas.width = this.width * pixelRatio
            canvas.height = this.height * pixelRatio
            canvas.style.width = `${this.width}px`
            canvas.style.height = `${this.height}px`
            this.context.scale(pixelRatio, pixelRatio)
        }
    }
    addListener() {
        this.canvas.addEventListener('mouseup', this.clickListener)
    }
    clickListener = (e) => {
        let z = window.getComputedStyle(canvas).zoom || 1   
        const x = e.pageX/z - e.target.offsetLeft
        const y = e.pageY/z - e.target.offsetTop

        const indexes = this.calculateIndexes({x,y})

        if (typeof this.clicked[`${indexes.x}:${indexes.y}`] === "undefined") {
            this.clicked[`${indexes.x}:${indexes.y}`] = createCell(indexes.x, indexes.y)
        } else {
            delete this.clicked[`${indexes.x}:${indexes.y}`]
        }
        this.clearField()
        this.createGrid()
        this.createWorld({random: false})
        this.drawWorld()
    }
    // Вычисление индекса из координат канвас
    calculateIndexes(path) {
        const indexes = {
            x: Math.floor(path.x / this.kernel),
            y: Math.floor(path.y / this.kernel)
        }
        return indexes
    }
    // Создаем популяцию
    createWorld({random}) {
        this.gameObjects = []
        for (let y = 0; y < GameWorld.numColumns; y++) {
            for (let x = 0; x < GameWorld.numRows; x++) {
                const alive = random 
                ? Math.random() > 0.5
                : !!this.clicked[`${x}:${y}`] 
                    ? 1 
                    : 0
                this.gameObjects.push(new Cell(this.context, x, y, alive, this.kernel, this.kernel))
            }
        }
    }
    // Рисуем сетку
    createGrid() {
        this.context.strokeStyle = "rgba(0,0,0, 0.3)"
        for (let i = 0; i < this.width; i += this.kernel) {
            this.context.beginPath()
            this.context.moveTo(i, 0)
            this.context.lineTo(i, this.height)
            this.context.stroke()

            this.context.beginPath()
            this.context.moveTo(0, i)
            this.context.lineTo(this.width, i)
            this.context.stroke()
        }
    }
    // Очищаем канвас
    clearField() {
        this.context.clearRect(0, 0, this.width, this.height)
    }
    isAlive(x, y) {
        const xPos = this.returnToField(x, GameWorld.numRows)
        const yPos = this.returnToField(y, GameWorld.numRows)
        // if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows){
        //     return false;
        // }
        return this.gameObjects[this.gridToIndex(xPos, yPos)].alive?1:0
    }
    returnToField(pos, rows) {
        if (pos > rows - 1) {
          return (-pos + rows)
        } else if (pos < 0) {
          return pos + rows
        } else {
          return pos
        }
      }
    gridToIndex(x, y){
        return x + (y * GameWorld.numColumns)
    }
    // Рисуем популяцию
    drawWorld() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw()
        }
    }
    // Выяисление популяции
    checkSurrounding () {
        if (!this.gameObjects.length) {
            this.createWorld({random: true})
        }
        // Цикл по всем клеткам
        for (let x = 0; x < GameWorld.numColumns; x++) {
            for (let y = 0; y < GameWorld.numRows; y++) {

                // Считаем живых соседей
                let numAlive = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1)
                let centerIndex = this.gridToIndex(x, y)

                if (numAlive == 2){
                    // Ничего
                    this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive
                }else if (numAlive == 3){
                    // Делаем живой
                    this.gameObjects[centerIndex].nextAlive = true
                }else{
                    // Делаем мертвой
                    this.gameObjects[centerIndex].nextAlive = false
                }
            }
        }

        // Обновляем состояние клеток
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].alive = this.gameObjects[i].nextAlive
        }
    }


}