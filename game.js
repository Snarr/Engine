import { Canvas, Group, Sprite, Input } from "./engine.js";

let myScheme = ["9e00f9","71049f","560986","aa05fc","8d00e4"]

let colorScheme = {
  "floor": "#"+myScheme[2],
  "player": "#"+myScheme[3],
  "background": "#"+myScheme[1],
  "pipes": "#"+myScheme[4]
}

let canvas, player, floor, background, pipes, gameover

function init() {
  canvas = new Canvas('canvas', 800, 800);

  player = new Sprite(100, 100, 50, 50, colorScheme.player);
  player.accelY = 1;

  floor = new Sprite(0, 600, 800, 200, colorScheme.floor);

  background = new Sprite(0, 0, canvas.width, canvas.height, colorScheme.background);

  gameover = false;

  setupControls();
  pipes = createPipes();
}

function setupControls() {  
  Input.init();
  Input.onKeyPress(['ArrowUp', 'w'], () => { player.speedY = -10 })
}

function generateRandomY() {
  return Math.random()*351 + 50;
}

function createPipes() {
  let pillarGroup = new Group();

  for (let i = 0; i < 4; i++) {
    let randomYOffset = generateRandomY();
    let startingX = 400+(200*i);

    let pipe = createPipe(startingX, randomYOffset);

    pillarGroup.push(pipe);
  }
  return pillarGroup;
}

function createPipe(posX, posY) {
  let group = new Group();
  group.push(new Sprite(posX, posY-500, 50, 500));
  group.push(new Sprite(posX, posY+150, 50, 500));
  group.color = colorScheme.pipes
  group.speedX = -3;

  return group;
}

function draw() {

  canvas.draw(background);
  canvas.draw(player);
  canvas.draw(pipes)
  canvas.draw(floor);
  
  if (gameover) {
    canvas.draw(new Sprite(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.5)'))
    canvas.draw(new Sprite(200, 350, 400, 100, 'rgb(50, 50, 50)', 25))
    canvas.text(400, 405, "Game Over", 60)
    return;
  }

  canvas.update(player);
  canvas.update(pipes);
  for (let i in pipes) {
    let singlePipe = pipes[i];
    if (singlePipe.collidesWith(player)) {
      singlePipe.speedX = 0; 
      gameover = true; 
    }
    let topPipe = singlePipe[0];

    if (topPipe.posX < -topPipe.width) {
      pipes[i] = createPipe(800, generateRandomY());
    }
  }
  if (player.goingToCollideWith(floor)) {
    player.posY = floor.top()-player.height;
  }
  if (player.collidesWith(floor)) {
    player.speedY = 0;
    gameover = true;
  };
}

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

startAnimating(60);

function startAnimating(fps) {
  init();
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  console.log(startTime);
  animate();
}

function animate() {

  // stop
  if (stop) {
      return;
  }

  // request another frame

  requestAnimationFrame(animate);

  // calc elapsed time since last loop

  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame

  if (elapsed > fpsInterval) {

      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      then = now - (elapsed % fpsInterval);

      // draw stuff here
      draw();

  }
}