import { Canvas, Sprite, Group } from "../../engine.js";

let canvas = new Canvas(800, 800)
canvas.stroke = true;

let rows = 100;
let columns = 100;

let tileWidth = canvas.width/columns;
let tileHeight = canvas.height/rows;

class Cell extends Sprite {
  constructor(posX, posY, width, height, alive) {
    super(posX, posY, width, height, alive ? 'purple' : 'white', 0);
    this.alive = alive;
  }

  birth() {
    this.alive = true;
    this.color = 'purple';
  }

  kill() {
    this.alive = false;
    this.color = 'white';
  } 
}

function buildGeneration(oldGeneration) {
  let Tiles = new Group();

  for (let row = 0; row < rows; row++) {
    let columnGroup = new Group();
    for (let column = 0; column < columns; column++) {
      let alive;
      if (oldGeneration) {
        alive = applyRules(oldGeneration, column, row)
      } else {
        alive = Math.random() > 0.5;
      }
      columnGroup.push(new Cell(row*tileHeight, column*tileWidth, tileWidth, tileHeight, alive));
    }
    Tiles.push(columnGroup);
  }

  return Tiles;
}

function applyRules(generation, x, y) {
  let liveNeighbors = 0;
  let checkedNeighbors = 0;

  let minCol = -1
  let minRow = -1
  let maxCol = 1;
  let maxRow = 1;

  if (x == 0) {
    minCol = 0;
  } else if (x == generation[0].length-1) {
    maxCol = 0;
  }
  if (y == 0) {
    minRow = 0;
  } else if (y == generation.length-1) {
    maxRow = 0;
  }

  for (let column = minCol; column <= maxCol; column++) {
    for (let row = minRow; row <= maxRow; row++) {
      if (column == 0 && row == 0) continue;
      checkedNeighbors++;

      if (generation[y+row][x+column].alive) {
        liveNeighbors++;
      }
    }
  }

  // Stay alive
  if (generation[y][x].alive && (liveNeighbors == 2 || liveNeighbors == 3)) {
    return true;
  }
  // Repopulation
  if (!generation[y][x].alive && (liveNeighbors == 3)) {
    return true;
  }
  // Dead from under or over population
  return false;
}

let background = new Sprite(0, 0, canvas.width, canvas.height, 'white');

let currentGeneration;

canvas.init = () => {
  currentGeneration = buildGeneration();
  canvas.draw(background);
  canvas.draw(currentGeneration)
}

canvas.drawFrame = () => {
  canvas.draw(background);
  canvas.draw(currentGeneration)
  currentGeneration = buildGeneration(currentGeneration);
}

canvas.start(30);