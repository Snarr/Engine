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

input.onKeyPress(['ArrowUp', 'w'], () => { player.setSpeedY(-10) })

function Pillars(posX, posY) {
  let pillarTop = new world.Sprite(posX, posY-500, 50, 500, 'black');
  pillarTop.setSpeedX(-3);
  pillarTop.setAnchored(true);

  let pillarBottom = new world.Sprite(posX, posY+150, 50, 500, 'black');
  pillarBottom.setSpeedX(-3);
  pillarBottom.setAnchored(true);

  let draw = () => {
    pillarTop.draw();
    pillarBottom.draw();
  }

  let update = () => {
    pillarTop.update();
    pillarBottom.update();
  }

  let collidesWith = (other) => {
    return pillarTop.collidesWith(other) || pillarBottom.collidesWith(other)
  }
  
  let setSpeedX = (speed) => {
    pillarTop.setSpeedX(0)
    pillarBottom.setSpeedX(0);
  }

  return { draw, update, collidesWith, setSpeedX }
}

let pillars1 = Pillars(500, 300)

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
    player.setSpeedY(0)
  }
  if (pillars1.collidesWith(player)) {
    pillars1.setSpeedX(0)
  }
}, 20)