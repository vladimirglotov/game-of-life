import { range } from "../../utils.js";
import { createCell } from "../cell.js";

export function populateRandom(rows, columns) {
  const population = {};

  range(columns).forEach((_, i) => {
    range(rows).forEach((_, j) => {
      if (Math.random() <= 0.5) return;
      population[`${i}:${j}`] = createCell(i, j);
    });
  });

  return population;
}
