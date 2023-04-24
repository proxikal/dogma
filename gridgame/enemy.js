export class Enemy {
    constructor(game, verticalPosition) {
        this.game = game;
        this.verticalPosition = verticalPosition;
        this.x = this.game.canvas.width;
        this.y = this.verticalPosition;
        this.width = this.game.cellSize - this.game.cellGap * 2;
        this.height = this.game.cellSize - this.game.cellGap * 2;
        this.speed = Math.random() * 0.1 + 0.3;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
        this.enemyType = this.game.enemyTypes[Math.floor(Math.random() * this.game.enemyTypes.length)];
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0; // won't need this.
        this.maxFrame = 9;
        this.spriteWidth = 90;
        this.spriteHeight = 100;
    }
    update() {
        this.x -= this.movement;
        if (this.game.frame % 10 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
    }
    draw(ctx) {
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '15px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 10);
        //this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}