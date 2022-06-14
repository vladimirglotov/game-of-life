export function createCell(x, y) {
  return { x, y };
}

export function neighborsOf({ x, y }, rows) {
  return [
    // Neighbors above:
    createCell(returnToField(x - 1, rows), returnToField(y - 1, rows)),
    createCell(x, returnToField(y - 1, rows)),
    createCell(returnToField(x + 1, rows), returnToField(y - 1, rows)),

    // ...On either side:
    createCell(returnToField(x - 1, rows), y),
    createCell(returnToField(x + 1, rows), y),

    // ...And below given cell:
    createCell(returnToField(x - 1, rows), returnToField(y + 1, rows)),
    createCell(x, returnToField(y + 1, rows)),
    createCell(returnToField(x + 1, rows), returnToField(y + 1, rows)),
  ];
}

export function isAlive(cell, population) {
  return !!population[`${cell.x}:${cell.y}`];
}

export function countAliveAround(cell, population, rows) {
  if (cell.y === 9) {
  }
  return neighborsOf(cell, rows).reduce((total, celll) => {
    return total + (isAlive(celll, population) ? 1 : 0);
  }, 0);
}


function returnToField(pos, rows) {
  if (pos > rows - 1) {
    return (-pos + rows)
  } else if (pos < 0) {
    return pos + rows
  } else {
    return pos
  }
}