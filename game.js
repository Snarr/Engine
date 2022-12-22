import { World, Input} from './engine.js'

let canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 800

let world = World(ctx, 1, 800, 800);
let input = world.Input(true);

let player = world.Sprite(100, 100, 100, 100, 'red');
let floor = world.Sprite(0, 600, 800, 200, 'green');
let background = world.Background('#34bdeb')

input.onKeyPress(['ArrowUp', 'w'], () => { player.setSpeedY(-10) })

function Pillars(posX, posY) {
  let pillarTop = world.Sprite(posX, posY-500, 100, 500, 'black');
  pillarTop.setSpeedX(-1);
  pillarTop.setAnchored(true);

  let pillarBottom = world.Sprite(posX, posY+150, 100, 500, 'black');
  pillarBottom.setSpeedX(-1);
  pillarBottom.setAnchored(true);

  let draw = () => {
    pillarTop.draw();
    pillarBottom.draw();
  }

  let update = () => {
    pillarTop.update();
    pillarBottom.update();
  }

  return { draw, update }
}

let pillars1 = Pillars(500, 300)

setInterval(() => {
  background.draw();
  pillars1.draw();
  pillars1.update();
  floor.draw();
  player.draw();
  player.update();
  if (player.collidesWith(floor)) { 
    player.setSpeedY(0)
  }
}, 30)