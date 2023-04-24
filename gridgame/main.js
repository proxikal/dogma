import { Cell } from './cell.js';
import { Handler } from './handlers.js';
import { FloatingMessage } from './floatingmessage.js';
import { Defender } from './defender.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 600;

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.gameGrid = [];
            this.defenders = [];
            this.enemies = [];
            this.enemyPositions = [];
            this.projectiles = [];
            this.resources = [];
            this.floatingMessages = [];
            this.cellSize = 100;
            this.cellGap = 3;
            this.numberOfResources = 300;
            this.frame = 0;
            this.enemiesInterval = 600;
            this.gameOver = false;
            this. score = 0;
            this.winningScore = 60000;
            this.chosenDefender = 1;
            this.health = 100;
            this.amounts = [20, 30, 40];
            this.mouse = {
                x: 10,
                y: 10,
                width: 0.1,
                height: 0.1,
                clicked: false,
            }
            this.canvasPosition = this.canvas.getBoundingClientRect();
            this.defenderTypes = [];
            this.defender1 = new Image();
            this.defender2 = new Image();
            this.defender1.src = 'assets/yellow-robot.png';
            this.defender2.src = 'assets/blue-robot.png'
            this.enemyTypes = [];
            this.enemy1 = new Image();
            this.enemy1.src = 'assets/Female-Zombie-Walking-Left.png';
            this.enemy2 = new Image();
            this.enemy2.src = 'assets/Male-Zombie-Walking-Left.png';
            this.enemyTypes.push(this.enemy1, this.enemy2);
        }
        collision(first, second) {
            if (!(first.x > second.x + second.width        ||
                    first.x + first.width < second.x        ||
                    first.y > second.y + second.height      || 
                    first.y + first.height < second.y) 
               ) {
                // No Collision
                return true;
            }
        }
    }
    const game = new Game(canvas);
    canvas.addEventListener('mousedown', function() {
        game.mouse.clicked = true;
    });
    canvas.addEventListener('mouseup', function() {
        game.mouse.clicked = false;
    });
    
    //let canvasPosition = canvas.getBoundingClientRect();
    
    
    // Resize window fix for mouse offset on grids
    window.addEventListener('resize', function() {
        game.canvasPosition = canvas.getBoundingClientRect();
    });
    
    canvas.addEventListener('mousemove', function(e) {
        game.mouse.x = e.x - game.canvasPosition.left;
        game.mouse.y = e.y - game.canvasPosition.top;
    });
    
    canvas.addEventListener('mouseleave', function() {
        game.mouse.x = 0;
        game.mouse.y = 0;
    });
    
    canvas.addEventListener('click', function() {
        const gridPositionX = game.mouse.x - (game.mouse.x % game.cellSize) + game.cellGap;
        const gridPositionY = game.mouse.y - (game.mouse.y % game.cellSize) + game.cellGap;
        if(gridPositionY < game.cellSize) return;
        for (let i = 0; i < game.defenders.length; i++) {
            if (game.defenders[i].x === gridPositionX && game.defenders[i].y === gridPositionY)
            return;
        }
        let defenderCost = 100;
        if (game.chosenDefender === 2) {
            defenderCost = 150;
        }
        if (game.numberOfResources >= defenderCost) {
            game.defenders.push(new Defender(game, gridPositionX, gridPositionY));
            game.numberOfResources -= defenderCost;
        } else {
            game.floatingMessages.push(new FloatingMessage("Not enough resources!", game.mouse.x, game.mouse.y, 20, 'red'));
    
        }
    });

    // gameboard
    const controlsBar = {
        width: canvas.width,
        height: game.cellSize,
    }

    function createGrid() {
        for (let y = game.cellSize; y < game.canvas.height; y += game.cellSize) {
            for (let x = 0; x < game.canvas.width; x += game.cellSize) {
                game.gameGrid.push(new Cell(game, x, y));

            }
        }
    }
    createGrid();

    // utilities

    function animate() {
        ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
        const handler = new Handler(game, ctx);
        handler.run();
        game.frame++;
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate();
});