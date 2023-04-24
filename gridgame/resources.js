export class Resource {
    constructor(game) {
        this.game = game;
        this.x = Math.random() * (this.game.canvas.width - this.game.cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * this.game.cellSize + 25;
        this.width = this.game.cellSize * 0.6;
        this.height = this.game.cellSize * 0.6;
        this.amount = this.game.amounts[Math.floor(Math.random() * this.game.amounts.length)];
    }
    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Orbitron';
        ctx.fillText(this.amount, this.x + 15, this.y + 25);
    }
}