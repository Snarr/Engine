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
    let speedY = 0;
    let anchored = false;
  
    let draw = () => {
      context.fillStyle = color;
      context.fillRect(posX, posY, width, height)
    } 
  
    let update = () => {
      posX += speedX;

      posY += speedY;
      if (!anchored) { speedY += gravity };
    }

    let setSpeedX = (x) => {
      speedX = x
    }

    let setSpeedY = (y) => {
      speedY = y
    }

    let setAnchored = (value) => {
      anchored = value
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
  
    return { draw, update, setAnchored, collidesWith, setSpeedX, setSpeedY, top, bottom, left, right };
  }
  return { Background, Sprite, Input };
}

function Input (debug) {
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

export { World, Input }