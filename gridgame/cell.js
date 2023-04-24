export class Cell {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = this.game.cellSize;
        this.height = this.game.cellSize;
    }

    draw(ctx) {
        if (this.game.mouse.x && this.game.mouse.y && this.game.collision(this, this.game.mouse)) {
            ctx.strokeStyle = 'black'
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}