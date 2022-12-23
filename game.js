import { World, Input} from './engine.js'

let canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 800

let world = new World(ctx, 1, 800, 800);
let input = new Input(true);

let player = new world.Sprite(100, 100, 50, 50, 'red');
let floor = new world.Sprite(0, 600, 800, 200, 'green');
let background = new world.Background('#34bdeb')

input.onKeyPress(['ArrowUp', 'w'], () => { player.speedY = -10})

function Pillars(posX, posY) {
  this.pillarTop = new world.Sprite(posX, posY-500, 50, 500, 'black');
  this.pillarTop.speedX = -3;
  this.pillarTop.anchored = true;

  this.pillarBottom = new world.Sprite(posX, posY+150, 50, 500, 'black');
  this.pillarBottom.speedX = -3;
  this.pillarBottom.anchored = true;

  this.draw = () => {
    this.pillarTop.draw();
    this.pillarBottom.draw();
  }

  this.update = () => {
    this.pillarTop.update();
    this.pillarBottom.update();
  }

  this.collidesWith = (other) => {
    return this.pillarTop.collidesWith(other) || this.pillarBottom.collidesWith(other)
  }
  
  this.setSpeedX = (speed) => {
    this.pillarTop.speedX = speed;
    this.pillarBottom.speedX = speed;
  }
}

let pillars1 = new Pillars(500, 300)

setInterval(() => {
  background.draw();
  pillars1.draw();
  floor.draw();
  player.draw();
}, 1)

setInterval(() => {
  pillars1.update();
  player.update();
  if (player.collidesWith(floor)) { 
    player.speedY = 0;
  }
  if (pillars1.collidesWith(player)) {
    pillars1.setSpeedX(0)
  }
}, 20)