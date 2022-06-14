import { countAliveAround, neighborsOf, createCell } from "./cell.js"
import { populateRandom } from "./population/random.js"

export class World {
  constructor(rows, columns, population) {
    if (!Object.keys(population).length) {
      population = populateRandom(rows, columns)
    }
    this.rows = rows
    this.columns = columns
    this.population = population
  }

  get cells() {
    return Object.values(this.population)
  }

  isVisible = ({ x, y }) => {
    const offset = 5
    return (
      x >= -offset &&
      y >= -offset &&
      x < this.columns + offset &&
      y < this.rows + offset
    )
  }


  evolve = () => {
    const evolved = {}
    const checked = {}
    this.cells.map((cell) => {
      if (!this.isVisible(cell)) return

      const alive = countAliveAround(cell, this.population, this.rows)
      console.log(alive)
      if (alive === 2 || alive === 3) {
        const { x, y } = cell
        evolved[`${x}:${y}`] = cell
      }

      neighborsOf(cell, this.rows).forEach((neighbor) => {
        const { x, y } = neighbor

        // Skip already checked cells.
        if (checked[`${x}:${y}`]) return
        checked[`${x}:${y}`] = true

        if (countAliveAround(neighbor, this.population, this.rows) !== 3) return
        evolved[`${x}:${y}`] = createCell(x, y)
      })
    })
    this.population = evolved
  }
}
