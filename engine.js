/**
 * 
 * @param {CanvasRenderingContext2D} context Document context for World to be drawn upon
 * @param {number} gravity Acceleration force applied downwards to unanchored Sprites
 * @param {number} width Width of the world for drawing the background
 * @param {number} height Height of the world for drawing the background
 * @returns 
 */
function World(context, gravity, width, height) {
  this.context = context;
  this.gravity = gravity;
  this.width = width;
  this.height = height;

  let world = this;

  this.Background = function (color) {
    this.parent = world;

    this.draw = () => {
      this.parent.context.fillStyle = color;
      this.parent.context.fillRect(0, 0, width, height);
    }
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
  this.Sprite = function (posX, posY, width, height, color) {
    this.parent = world;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
    this.anchored = false;
  
    /**
     * Draws the sprite as a Rectangle according to its color, position, width, and height
     */
    this.draw = function () {
      this.parent.context.fillStyle = this.color;
      this.parent.context.fillRect(this.posX, this.posY, this.width, this.height)
    }
    
    /**
     * Updates the Sprite's position according to its speed
     */
    this.update = function () {
      this.posX += this.speedX;

      this.posY += this.speedY;
      if (!this.anchored) { this.speedY += this.parent.gravity };
    }

    this.top = function  () { return this.posY };
    this.bottom = function () { return this.posY + this.height };
    this.left = function () { return this.posX };
    this.right = function () { return this.posX + this.width };
    
    /**
     * 
     * @param {Sprite} other 
     * @returns {Boolean} True if Sprite is colliding with other Sprite
     */
    this.collidesWith = function (other) {
      return (this.left()-1 < other.right() &&
      this.right()+1 > other.left() &&
      this.top()-1 < other.bottom() &&
      this.bottom()+1 > other.top())
    }
  
    // return { draw, update, setAnchored, collidesWith, setSpeedX, setSpeedY, top, bottom, left, right };
  }
}


/**
 * 
 * @param {Boolean} debug Enable console logs helpful for debugging
 * @returns {onKeyPress}
 */
function Input (debug) {
  this.listeners = {};
 
  /**
   * 
   * @param {string|string[]} k String or array of strings representing key(s) to trigger callback
   * @param {function} callback Function to run when key(s) are pressed
   */
  this.onKeyPress = (k, callback) => {
    if (Array.isArray(k)) {
      for (let i = 0; i < k.length; i++) {
        let key = k[i];

        if (typeof key != "string") throw new TypeError(`Invalid key in array at index ${i}: ${key}`)

        this.listeners[key] = callback;
      }
    } else if (typeof k == "string") {
      this.listeners[k] = callback;
    } else {
      throw new TypeError(`Invalid argument, please enter a String or Array`)
    }
  }

  this.executeListeners = (event) => {
    if (debug) console.log(event.key)
    if (this.listeners[event.key]) {
      this.listeners[event.key]()
    }
  }

  document.addEventListener('keydown', this.executeListeners);

  // return { onKeyPress }
}

export { World, Input }