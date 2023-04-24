import { Projectile } from './projectile.js';

export class Defender {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = this.game.cellSize - this.game.cellGap * 2;
        this.height = this.game.cellSize - this.game.cellGap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.minFrame = 0;
        this.maxFrame = 9;
        this.chosenDefender = this.game.chosenDefender;
    }


    draw(ctx) {
        // ctx.fillStyle = 'blue';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '15px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 25, this.y + 10);
        if (this.chosenDefender === 1) {
            ctx.drawImage(this.game.defender1, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        } else if (this.chosenDefender === 2) {
            ctx.drawImage(this.game.defender2, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }
    update() {
        if (this.game.frame % 8 === 0) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            if (this.chosenDefender === 1) {
                if (this.frameX === 14) this.shootNow = true;
            }
            if (this.chosenDefender === 1) {
                if (this.frameX === 14) this.shootNow = true;
            } else if (this.chosenDefender === 2) {
                if (this.frameX === 11 || this.frameX === 17) this.shootNow = true;
            }
        }

        if (this.shooting) {
            this.minFrame = 10;
            this.maxFrame = 18;
        } else {
            this.minFrame = 0;
            this.maxFrame = 9;
        }

        if (this.shooting && this.shootNow) {
            if (this.timer % 100 === 0) {
                if (this.chosenDefender === 1) {
                    this.game.projectiles.push(new Projectile(this.x + 70, this.y + 50));
                } else if (this.chosenDefender === 2) {
                    let projectMore = new Projectile(this.x + 70, this.y + 50);
                    projectMore.power = 15;
                    this.game.projectiles.push(projectMore);
                }
                
                this.shootNow = false;
            }
        }
    }
}