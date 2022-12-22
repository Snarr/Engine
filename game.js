function World(context, gravity, width, height) {
  let Background = (color) => {

    let draw = () => {
      context.fillStyle = color;
      context.fillRect(0, 0, width, height);
    }
    return { draw };
  }

  let Sprite = (posX, posY, width, height, color) => {
    let speedX = 0;
    let speedY = 10;
  
    let draw = () => {
      context.fillStyle = color;
      context.fillRect(posX, posY, width, height)
    } 
  
    let move = () => {
      posX += speedX;

      posY += speedY;
      // speedY += gravity;
    }

    let setSpeedX = (x) => {
      speedX = x
    }

    let setSpeedY = (y) => {
      speedY = y
    }

    let top = () => { return posY };
    let bottom = () => { return posY + height };
    let left = () => { return posX };
    let right = () => { return posX + width };
    
    let collidesWith = (other) => {
      return (left()-1 < other.right() &&
      right()+1 > other.left() &&
      top()-1 < other.bottom() &&
      bottom()+1 > other.top())
    }
  
    return { draw, move, collidesWith, setSpeedX, setSpeedY, top, bottom, left, right };
  }

  let Input = (debug) => {
    let listeners = {};
    
    let onKeyPress = (key, func) => {
      listeners[key] = func;
      console.log(`Listener added: ${key}`)
    }

    let executeListeners = (event) => {
      if (debug) console.log(event.key)
      try {
        listeners[event.key]()
      } catch (error) {

      }
    }

    document.addEventListener('keydown', executeListeners);

    return { onKeyPress }
  }

  return { Background, Sprite, Input };
}




let canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 800

let world = World(ctx, 1, 800, 800);
let input = world.Input(true);

let player = world.Sprite(100, 100, 100, 100, 'red');
let floor = world.Sprite(0, 600, 800, 200, 'green');
let background = world.Background('#34bdeb')

input.onKeyPress('ArrowUp', () => { player.setSpeedY(-5) })


setInterval(() => {
  background.draw()
  floor.draw();
  player.draw()
  if (!player.collidesWith(floor)) { player.move() }
}, 30)