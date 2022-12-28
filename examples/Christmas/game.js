import { Canvas, Sprite, Group } from "https://cdn.jsdelivr.net/gh/Snarr/Engine/engine.js";

let possibleColors = ['red', 'blue', 'yellow', 'orange', 'purple', 'pink', 'lime']

function randomRange(minMaxArr) {
  let min = minMaxArr[0]
  let max = minMaxArr[1]
  return Math.random()*(max-min) + min;
}
function randomColor() {
  return possibleColors[Math.floor(Math.random()*possibleColors.length)]
}

let branchLengths = [6,5,5,5,5,6];
let treeDescription = [];
let rowLength = 1;
for (let branch of branchLengths) {
	for (let i = 0; i < branch; i++) {
		treeDescription.push(rowLength);
    rowLength += 2;
  }
  rowLength -= 6;
}

let canvas = new Canvas(800, 800);

let treeImage = new Image();
treeImage.src = './high-res-tree.png'

let backgroundImage = new Image();
backgroundImage.src = './background.jpg'
let background = new Sprite(0, 0, 800, 800, "white", 5, backgroundImage);

let tree = new Sprite(70, 80, 660, 700, "red", 0, treeImage)

canvas.init = () => {
}

canvas.drawFrame = () => {
  let LightGroup = new Group();
  for (let i = 0; i < treeDescription.length; i++) {
    for (let j = 0; j < treeDescription[i]; j += 2) {
      let rowWidth = treeDescription[i]*20
      LightGroup.push(new Sprite((800-rowWidth)/2 + j*20, i*20+80, 20, 20, 'green'));
      if (Math.random()>0.2) continue;
      LightGroup.push(new Sprite((800-rowWidth)/2 + j*20, i*20+80, 20, 20, randomColor()));
    }
  }

  canvas.draw(background);
  canvas.text(400, 40, "Merry Xmas", 24, 'white')
  canvas.draw(tree);
  canvas.draw(LightGroup);
  canvas.update(tree);
}

canvas.start(1);