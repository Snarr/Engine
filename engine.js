class Canvas {
    constructor(id, width, height) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.element = document.getElementById(this.id);
        this.element.width = this.width;
        this.element.height = this.height;
        this.context = this.element.getContext('2d');
    }
    draw(s) {
        if (s instanceof Sprite) {
            this.drawSprite(s);
        }
        else if (s instanceof Group) {
            for (let sprite of s) {
                this.draw(sprite);
            }
        }
    }
    update(s) {
        if (s instanceof Sprite) {
            this.updateSprite(s);
        }
        else if (s instanceof Group) {
            for (let sprite of s) {
                this.update(sprite);
            }
        }
    }
    text(posX, posY, textVal, size, color) {
        this.context.fillStyle = color;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.font = `${size}px Verdana`;
        this.context.fillText(textVal, posX, posY);
    }
    updateSprite(sprite) {
        sprite.posX += sprite.speedX;
        sprite.posY += sprite.speedY;
        sprite.speedX += sprite.accelX;
        sprite.speedY += sprite.accelY;
    }
    drawSprite(sprite) {
        var _a;
        if (sprite.image) {
            this.context.drawImage(sprite.image, sprite.posX, sprite.posY);
        }
        else {
            this.context.fillStyle = sprite.color;
            this.context.beginPath();
            (_a = this.context) === null || _a === void 0 ? void 0 : _a.roundRect(sprite.posX, sprite.posY, sprite.width, sprite.height, sprite.cornerRadius);
            this.context.fill();
        }
    }
    start(fps) {
        let stop = false;
        let frameCount = 0;
        let now;
        let elapsed;
        let fpsInterval = 1000 / fps;
        let then = Date.now();
        let startTime = then;
        this.init();
        this.stop = () => { stop = true; };
        var animate = () => {
            if (stop) {
                return;
            }
            requestAnimationFrame(animate);
            now = Date.now();
            elapsed = now - then;
            if (elapsed > fpsInterval) {
                then = now - (elapsed % fpsInterval);
                this.drawFrame();
            }
        };
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
};
class Group extends Array {
    constructor() {
        super();
        for (let prop of Object.keys(spriteProperties)) {
            Object.defineProperty(this, prop, {
                get: () => { return null; },
                set: (val) => {
                    for (let sprite of this) {
                        sprite[prop] = val;
                    }
                }
            });
        }
    }
    collidesWith(otherSprite) {
        for (let sprite of this) {
            if (sprite.collidesWith(otherSprite))
                return true;
        }
        return false;
    }
    move(dX, dY) {
        for (let sprite of this) {
            sprite.move(dX, dY);
        }
    }
}
class Sprite {
    constructor(posX, posY, width, height, color, cornerRadius, image) {
        this.speedX = 0;
        this.speedY = 0;
        this.accelX = 0;
        this.accelY = 0;
        this.cornerRadius = 0;
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.color = color;
        if (cornerRadius) {
            this.cornerRadius = cornerRadius;
        }
        ;
        if (image) {
            this.image = image;
        }
    }
    move(dX, dY) {
        this.posX += dX;
        this.posY += dY;
    }
    top() { return this.posY; }
    bottom() { return this.posY + this.height; }
    left() { return this.posX; }
    right() { return this.posX + this.width; }
    collidesWith(otherSprite) {
        return (this.left() - 1 < otherSprite.right() &&
            this.right() + 1 > otherSprite.left() &&
            this.top() - 1 < otherSprite.bottom() &&
            this.bottom() + 1 > otherSprite.top());
    }
    goingToCollideWith(otherSprite) {
        return (this.left() + this.speedX - 1 < otherSprite.right() &&
            this.right() + this.speedX + 1 > otherSprite.left() &&
            this.top() + this.speedY - 1 < otherSprite.bottom() &&
            this.bottom() + this.speedY + 1 > otherSprite.top());
    }
}
class Input {
    static init() {
        document.addEventListener('keydown', Input.executeListeners);
        return Input;
    }
    static onKeyPress(keys, callback) {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            Input.listeners[key] = callback;
        }
    }
}
Input.debug = false;
Input.listeners = {};
Input.executeListeners = (event) => {
    if (Input.debug)
        console.log(event.key);
    if (Input.listeners[event.key]) {
        Input.listeners[event.key]();
    }
};
export { Canvas, Group, Sprite, Input };
