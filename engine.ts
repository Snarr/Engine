class Canvas {
  id: string;
  element: HTMLCanvasElement | null; 
  context: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  stop: Function | null;
  init: Function | null;
  drawFrame: Function | null;

  constructor (id: string, width: number, height: number) {
    this.id = id;
    this.width = width;
    this.height = height;

    this.element = <HTMLCanvasElement> document.getElementById(this.id);
    this.element.width = this.width;
    this.element.height = this.height;
    this.context = this.element.getContext('2d');
  }

  draw(s: Sprite|Group): void {
    if (s instanceof Sprite) {
      this.drawSprite(s);
    } else if (s instanceof Group) {
      for (let sprite of s) {
        this.draw(sprite);
      }
    }
  }

  update(s: Sprite|Group): void {
    if (s instanceof Sprite) {
      this.updateSprite(s);
    } else if (s instanceof Group) {
      for (let sprite of s) {
        this.update(sprite);
      }
    }  
  }

  text(posX, posY, textVal, size) {
    this.context.fillStyle = 'white'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'
    this.context.font = `${size}px Verdana`
    this.context.fillText(textVal, posX, posY)
  }

  private updateSprite(sprite: Sprite): void {
    sprite.posX += sprite.speedX;
    sprite.posY += sprite.speedY;
    sprite.speedX += sprite.accelX;
    sprite.speedY += sprite.accelY;
  }

  private drawSprite(sprite: Sprite): void {
    if (sprite.image) {
      this.context.drawImage(sprite.image, sprite.posX, sprite.posY)
    } else {
      this.context!.fillStyle = sprite.color;
      this.context.beginPath();
      this.context?.roundRect(sprite.posX, sprite.posY, sprite.width, sprite.height, sprite.cornerRadius);
      this.context.fill();
    }
  }

  start(fps: number) {
    let stop = false;
    let frameCount = 0;
    let now: number;
    let elapsed: number;

    let fpsInterval = 1000 / fps;
    let then = Date.now();
    let startTime = then;
    this.init();

    this.stop = () => { stop = true }

    var animate = () => {
  
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
          this.drawFrame();
    
      }
    }
    
    animate();
  }
}

let spriteProperties = {
  "posX": 0,
  "posY": 0,
  "speedX": 0,
  "speedY": 0,
  "accelX": 0,
  "accelY": 0,
  "width": 0,
  "height": 0,
  "color": '',
}

class Group extends Array {

  constructor () {
    super();

    for (let prop of Object.keys(spriteProperties)) {
      Object.defineProperty(this, prop, {
        get: () => { return null },
        set: (val) => { 
          for (let sprite of this) {
            sprite[prop] = val;
          }
        }
      })
    }
  }

  collidesWith(otherSprite: Sprite): boolean {
    for (let sprite of this) {
      if (sprite.collidesWith(otherSprite)) return true;
    }
    return false;
  }

  move(dX, dY): void {
    for (let sprite of this) {
      sprite.move(dX, dY)
    }
  }
}

class Sprite {
  posX: number;
  posY: number;

  speedX: number = 0;
  speedY: number = 0;

  accelX: number = 0;
  accelY: number = 0;

  width: number;
  height: number;
  color: string;

  cornerRadius: number = 0;

  image: HTMLImageElement | null;

  constructor (posX: number, posY: number, width: number, height: number, color: string, cornerRadius?: number, image?: HTMLImageElement) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.color = color;
    if (cornerRadius) { 
      this.cornerRadius = cornerRadius
    };
    if (image) {
      this.image = image;
    }
  }

  move(dX: number, dY: number): void {
    this.posX += dX;
    this.posY += dY;
  }

  top() { return this.posY; }
  bottom() { return this.posY + this.height; }
  left() { return this.posX; }
  right() { return this.posX + this.width }

  collidesWith(otherSprite: Sprite): boolean {
    return (this.left()-1 < otherSprite.right() &&
            this.right()+1 > otherSprite.left() &&
            this.top()-1 < otherSprite.bottom() &&
            this.bottom()+1 > otherSprite.top())
  }
  goingToCollideWith(otherSprite: Sprite): boolean {
    return (this.left()+this.speedX - 1 < otherSprite.right() &&
            this.right()+this.speedX + 1 > otherSprite.left() &&
            this.top()+this.speedY - 1 < otherSprite.bottom() &&
            this.bottom()+this.speedY + 1 > otherSprite.top());
  }
}

class Input {
  static debug: boolean = false;
  static listeners: Object = {};

  // constructor (debug: boolean) {
  //   Input.debug = debug;

  static init() {
    document.addEventListener('keydown', Input.executeListeners);
    return Input;
  }
  // }

  static onKeyPress (keys: Array<string>, callback: () => void) {
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];

      Input.listeners[key] = callback;
    }
  }

  static executeListeners = (event: KeyboardEvent) => {
    if (Input.debug) console.log(event.key);
    if (Input.listeners[event.key]) {
      Input.listeners[event.key]();
    }
  }
}

export { Canvas, Group, Sprite, Input }