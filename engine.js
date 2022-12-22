/**
 * 
 * @param {CanvasRenderingContext2D} context Document context for World to be drawn upon
 * @param {number} gravity Acceleration force applied downwards to unanchored Sprites
 * @param {number} width Width of the world for drawing the background
 * @param {number} height Height of the world for drawing the background
 * @returns 
 */
function World(context, gravity, width, height) {
  let Background = (color) => {

    let draw = () => {
      context.fillStyle = color;
      context.fillRect(0, 0, width, height);
    }
    return { draw };
  }

  /**
   * 
   * @param {number} posX 
   * @param {number} posY 
   * @param {number} width 
   * @param {number} height 
   * @param {string} color 
   * @returns
   */
  function Sprite (posX, posY, width, height, color) {
    let speedX = 0;
    let speedY = 0;
    let anchored = false;
  
    function draw () {
      context.fillStyle = color;
      context.fillRect(posX, posY, width, height)
    }
    
    function update () {
      posX += speedX;

      posY += speedY;
      if (!anchored) { speedY += gravity };
    }

    /**
     * Set the horizontal speed of the Sprite
     * @param {number} x 
     */
    function setSpeedX (x) {
      speedX = x
    }

    /**
     * Set the vertical speed of the Sprite
     * @param {number} y 
     */
    function setSpeedY (y) {
      speedY = y
    }

    /**
     * Set whether or not the object will be affected by other forces (gravity, other Sprites)
     * @param {Boolean} value 
     */
    function setAnchored (value) {
      anchored = value
    }

    function top () { return posY };
    function bottom () { return posY + height };
    function left () { return posX };
    function right () { return posX + width };
    
    /**
     * 
     * @param {Sprite} other 
     * @returns {Boolean} True if Sprite is colliding with other Sprite
     */
    function collidesWith (other) {
      return (left()-1 < other.right() &&
      right()+1 > other.left() &&
      top()-1 < other.bottom() &&
      bottom()+1 > other.top())
    }
  
    return { draw, update, setAnchored, collidesWith, setSpeedX, setSpeedY, top, bottom, left, right };
  }
  return { Background, Sprite, Input };
}


/**
 * 
 * @param {Boolean} debug Enable console logs helpful for debugging
 * @returns {onKeyPress}
 */
function Input (debug) {
  let listeners = {};
 
  /**
   * 
   * @param {string|string[]} k String or array of strings representing key(s) to trigger callback
   * @param {function} callback Function to run when key(s) are pressed
   */
  function onKeyPress (k, callback) {
    if (Array.isArray(k)) {
      for (let i = 0; i < k.length; i++) {
        let key = k[i];

        if (typeof key != "string") throw new TypeError(`Invalid key in array at index ${i}: ${key}`)

        listeners[key] = callback;
      }
    } else if (typeof k == "string") {
      listeners[k] = callback;
    } else {
      throw new TypeError(`Invalid argument, please enter a String or Array`)
    }
  }

  let executeListeners = (event) => {
    if (debug) console.log(event.key)
    if (listeners[event.key]) {
      listeners[event.key]()
    }
  }

  document.addEventListener('keydown', executeListeners);

  return { onKeyPress }
}

export { World, Input }