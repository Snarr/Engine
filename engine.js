class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.element = document.createElement("canvas");
        this.element.width = this.width;
        this.element.height = this.height;
        this.context = this.element.getContext('2d');
        document.body.appendChild(this.element);
    }
    draw(spriteLike) {
        if (spriteLike instanceof Sprite) {
            this.drawSprite(spriteLike);
        }
        else if (spriteLike instanceof Group) {
            for (let sprite of spriteLike) {
                this.draw(sprite);
            }
        }
    }
    update(spriteLike) {
        if (spriteLike instanceof Sprite) {
            this.updateSprite(spriteLike);
        }
        else if (spriteLike instanceof Group) {
            for (let sprite of spriteLike) {
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
            if (this.stroke)
                this.context.stroke();
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
class Group extends Array {
    constructor() {
        super();
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
    setPropertyOfChildren(key, value) {
        for (let sprite of this) {
            sprite[key] = value;
        }
    }
    set(key, value) {
        for (let sprite of this) {
            sprite[key] = value;
        }
    }
    set posX(x) { this.setPropertyOfChildren('posX', x); }
    set posY(y) { this.setPropertyOfChildren('posY', y); }
    set speedX(x) { this.setPropertyOfChildren('speedX', x); }
    set speedY(y) { this.setPropertyOfChildren('speedY', y); }
    set accelX(x) { this.setPropertyOfChildren('accelX', x); }
    set accelY(y) { this.setPropertyOfChildren('accelY', y); }
    set width(w) { this.setPropertyOfChildren('width', w); }
    set height(h) { this.setPropertyOfChildren('height', h); }
    set color(color) { this.setPropertyOfChildren('color', color); }
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
    static onMouseEvent(event, callback) {
        document.addEventListener(event, callback);
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
Input.mouseEvents = {};
Input.executeListeners = (event) => {
    if (Input.debug)
        console.log(event.key);
    if (Input.listeners[event.key]) {
        Input.listeners[event.key]();
    }
};
class Image {
    constructor(src, width, height) {
        this.src = src;
        this.width = width;
        this.height = height;
    }
}
export { Canvas, Group, Sprite, Input };
