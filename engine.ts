class Canvas {
  id: string;
  element: HTMLCanvasElement | null; 
  context: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  stop: Function | null;
  init: Function | null;
  drawFrame: Function | null;
  stroke: boolean | null;

  constructor ( width: number, height: number) {
    this.width = width;
    this.height = height;

    this.element = document.createElement("canvas");
    this.element.width = this.width;
    this.element.height = this.height;
    this.context = this.element.getContext('2d');

    document.body.appendChild(this.element);
  }

  draw(spriteLike: ISprite): void {
    if (spriteLike instanceof Sprite) {
      this.drawSprite(spriteLike);
    } else if (spriteLike instanceof Group) {
      for (let sprite of spriteLike) {
        this.draw(sprite);
      }
    }
  }

  update(spriteLike: ISprite): void {
    if (spriteLike instanceof Sprite) {
      this.updateSprite(spriteLike);
    } else if (spriteLike instanceof Group) {
      for (let sprite of spriteLike) {
        this.update(sprite);
      }
    }
  }

  text(posX, posY, textVal, size, color) {
    this.context.fillStyle = color
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
      if (this.stroke) this.context.stroke();
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

interface ISprite {
  posX: number,
  posY: number,
  speedX: number,
  speedY: number,
  accelX: number,
  accelY: number,
  width: number,
  height: number,
  color: string,
  collidesWith: (otherSprite: ISprite) => boolean,
  move: (dX: number, dY: number) => void,
}

class Group extends Array<ISprite> implements ISprite {
  constructor () {
    super();
  }

  collidesWith(otherSprite: ISprite): boolean {
    for (let sprite of this) {
      if (sprite.collidesWith(otherSprite)) return true;
    }
    return false;
  }

  move(dX: number, dY: number): void {
    for (let sprite of this) {
      sprite.move(dX, dY)
    }
  }

  private setPropertyOfChildren<Key extends keyof ISprite, Type extends ISprite[Key]>(key: Key, value: Type) {
    for (let sprite of this) {
      sprite[key] = <Type> value;
    }
  }

  set<Key extends keyof ISprite>(key: Key, value: ISprite[Key]): void {
    for (let sprite of this) {
      sprite[key] = value;
    }
  }

  set posX(x: number) { this.setPropertyOfChildren('posX', x) }
  set posY(y: number) { this.setPropertyOfChildren('posY', y) }
  set speedX(x: number) { this.setPropertyOfChildren('speedX', x) }
  set speedY(y: number) { this.setPropertyOfChildren('speedY', y) }
  set accelX(x: number) { this.setPropertyOfChildren('accelX', x) }
  set accelY(y: number) { this.setPropertyOfChildren('accelY', y) }
  set width(w: number) { this.setPropertyOfChildren('width', w) }
  set height(h: number) { this.setPropertyOfChildren('height', h) }
  set color(color: string) { this.setPropertyOfChildren('color', color)}
}

class Sprite implements ISprite {
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

  top(): number { return this.posY; }
  bottom(): number { return this.posY + this.height; }
  left(): number { return this.posX; }
  right(): number { return this.posX + this.width }

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


// Experimental stucture for setting Event Listeners
// Structure involves storing AbortControllers and returning IDs to destroy event listeners when necessary

// type MouseEvent = "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "click" | "dblclick"
type MouseState = "down" | "up";

// type MouseEventMap = {
//   [name in MouseEvent]: Array<AbortController>;
// };

class Input {
  static debug: boolean = false;
  static listeners: Object = {};
  static mouseEvents: Object = {};
  // static mouseState: MouseState = "up";

  static init() {
    document.addEventListener('keydown', Input.executeListeners);
    return Input;
  }

  static onMouseEvent(event: string, callback: () => void): void {
    // const controller = new AbortController();
    document.addEventListener(event, callback);
    // Input.mouseEvents[event].push(controller);
    // return Input.mouseEvents[event].length-1;
  }

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

class Image {
  src: string;
  width: number;
  height: number;
  constructor(src, width, height) {
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

export { Canvas, Group, Sprite, Input }