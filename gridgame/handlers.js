import { Resource } from './resources.js';
import { FloatingMessage } from './floatingmessage.js';
import { Enemy } from './enemy.js';


export class Handler {
    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;
    }
    projectiles() {
        for (let i = 0; i < this.game.projectiles.length; i++) {
            this.game.projectiles[i].update();
            this.game.projectiles[i].draw(this.ctx);
    
            for (let j = 0; j < this.game.enemies.length; j++) {
                if (this.game.enemies[j] && this.game.projectiles[i] && this.game.collision(this.game.projectiles[i], this.game.enemies[j])) {
                    this.game.enemies[j].health -= this.game.projectiles[i].power;
                    this.game.projectiles.splice(i, 1);
                    i--;
                }
            }
    
            
            if (this.game.projectiles[i] && this.game.projectiles[i].x > this.game.canvas.width - this.game.cellSize) {
                this.game.projectiles.splice(i, 1);
                i--;
            }
        }
    }
    gameStatus() {
        this.ctx.fillStyle = 'gold'
        this.ctx.font = '20px Orbitron';
        this.ctx.fillText('Resources: ' + this.game.numberOfResources, 175, 20);
        this.ctx.fillText('Score: ' + this.game.score, 175, 38);
        this.ctx.fillText('Health: ' + this.game.health, 175, 56);
        if (this.game.gameOver) {
            this.ctx.fillStyle = 'black'
            this.ctx.font = '90px Orbitron';
            this.ctx.fillText('GAME OVER', 135, 330);
        }
    
        if (this.game.score >= this.game.winningScore && this.game.enemies.length === 0) {
            this.ctx.fillStyle = 'black'
            this.ctx.font = '40px Orbitron';
            this.ctx.fillText('Level Complete!', 200, 330);
            this.ctx.font = '30px Orbitron';
            this.ctx.fillText("You win with: " + this.game.score + " points!", 245, 360);
        }
    }
    resources() {
        if (this.game.frame % 500 === 0 && this.game.score < this.game.winningScore) {
            this.game.resources.push(new Resource(this.game));
        }
        for (let i = 0; i < this.game.resources.length; i++) {
            this.game.resources[i].draw(this.ctx);
            if (this.game.resources[i] && this.game.mouse.x && this.game.mouse.y && this.game.collision(this.game.resources[i], this.game.mouse)) {
                this.game.numberOfResources += this.game.resources[i].amount;
                this.game.floatingMessages.push(new FloatingMessage("+" + this.game.resources[i].amount, this.game.resources[i].x, this.game.resources[i].y, 30, 'black'));
                this.game.floatingMessages.push(new FloatingMessage("+" + this.game.resources[i].amount, 295, 40, 30, 'gold'));
                this.game.resources.splice(i, 1);
                i--;
            }
        }
    }
    defenders() {
        for (let i = 0; i < this.game.defenders.length; i++) {
            this.game.defenders[i].draw(this.ctx);
            this.game.defenders[i].update();
            if (this.game.enemyPositions.indexOf(this.game.defenders[i].y) !== -1) {
                this.game.defenders[i].shooting = true;
            } else {
                this.game.defenders[i].shooting = false;
            }

        
            for(let j = 0; j < this.game.enemies.length; j++) {
                if (this.game.defenders[i]) {
                    if(this.game.collision(this.game.defenders[i], this.game.enemies[j])) {
                        this.game.enemies[j].movement = 0;
                        this.game.defenders[i].health -= 0.2;
                    }
                    if (this.game.defenders[i].health <= 0) {
                        this.game.defenders.splice(i, 1);
                        i--;
                        this.game.enemies[j].movement = this.game.enemies[j].speed;
                    }
                }
            }
        }
    }
    enemies() {
        for (let i = 0; i < this.game.enemies.length; i++) {
            this.game.enemies[i].update();
            this.game.enemies[i].draw(this.ctx);
            // this.game over condition (will probably add more later)
            if (this.game.enemies[i].x <= 0) {
                this.game.health -= Math.floor(this.game.enemies[i].health / 10);
                this.game.enemies.splice(i, 1);
                i--;
                if (this.game.health <= 0) {
                    this.game.gameOver = true;
                }
            }

            if (this.game.enemies[i] && this.game.enemies[i].health <= 0) {
                let gainedResources = this.game.enemies[i].maxHealth / 10;
                this.game.numberOfResources += gainedResources;
                this.game.score += gainedResources;
                const findThisIndex = this.game.enemyPositions.indexOf(this.game.enemies[i].y);
                this.game.floatingMessages.push(new FloatingMessage("+" + gainedResources, this.game.enemies[i].x, this.game.enemies[i].y, 30, 'black'));
                this.game.floatingMessages.push(new FloatingMessage("+" + gainedResources, 295, 40, 30, 'gold'));
                this.game.enemyPositions.splice(findThisIndex, 1);
                this.game.enemies.splice(i, 1);
                i--;
            }
        }


        if (this.game.frame % this.game.enemiesInterval === 0 && this.game.score < this.game.winningScore) {
            let verticalPosition = Math.floor(Math.random() * 5 + 1) * this.game.cellSize + this.game.cellGap;
            let newEnemy = new Enemy(this.game, verticalPosition);
            if (this.game.enemiesInterval > 120) newEnemy.speed += 1;
            this.game.enemies.push(newEnemy)
            this.game.enemyPositions.push(verticalPosition);
            if (this.game.enemiesInterval > 120) this.game.enemiesInterval -= 40;
            
        }
    }
    floatingMessages() {
        for (let i = 0; i < this.game.floatingMessages.length; i++) {
            this.game.floatingMessages[i].update();
            this.game.floatingMessages[i].draw(this.ctx);
            if (this.game.floatingMessages[i].lifeSpan >= 50) {
                this.game.floatingMessages.splice(i, 1);
                i--;
            }
        }
    }
    chooseDefender() {
        let card1stroke = 'black';
        let card2stroke = 'black';
        const card1 = {
            x: 10,
            y: 10,
            width: 70,
            height: 85
        }
        const card2 = {
            x: 90,
            y: 10,
            width: 70,
            height: 85
        }
        if (this.game.collision(this.game.mouse, card1) && this.game.mouse.clicked) {
            this.game.chosenDefender = 1;
        } else if (this.game.collision(this.game.mouse, card2) && this.game.mouse.clicked) {
            this.game.chosenDefender = 2;
        }
        if (this.game.chosenDefender === 1) {
            card1stroke = 'gold';
            card2stroke = 'black';
        } else if (this.game.chosenDefender === 2) {
            card1stroke = 'black';
            card2stroke = 'gold';
        } else {
            card1stroke = 'black';
            card2stroke = 'black';
        }
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
        this.ctx.strokeStyle = card1stroke;
        this.ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
        this.ctx.drawImage(this.game.defender1, 0, 0, 100, 100, 0, 2, 1920/19, 100);
        this.ctx.strokeStyle = card2stroke;
        this.ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
        this.ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
        this.ctx.drawImage(this.game.defender2, 0, 0, 100, 100, 80, 2, 1920/19, 100);
    }
    gameGrid() {
        for (let i = 0; i < this.game.gameGrid.length; i++) {
            this.game.gameGrid[i].draw(this.ctx);
        }
    }
    run() {
        this.gameGrid();
        this.resources();
        this.defenders();
        this.projectiles();
        this.enemies();
        this.chooseDefender();
        this.gameStatus();
        this.floatingMessages();
    }
}



// export function projectiles(game, ctx) {
//     for (let i = 0; i < game.projectiles.length; i++) {
//         game.projectiles[i].update();
//         game.projectiles[i].draw(ctx);

//         for (let j = 0; j < game.enemies.length; j++) {
//             if (game.enemies[j] && game.projectiles[i] && game.collision(game.projectiles[i], game.enemies[j])) {
//                 game.enemies[j].health -= game.projectiles[i].power;
//                 game.projectiles.splice(i, 1);
//                 i--;
//             }
//         }

        
//         if (game.projectiles[i] && game.projectiles[i].x > game.canvas.width - game.cellSize) {
//             game.projectiles.splice(i, 1);
//             i--;
//         }
//     }
// }

// export function gameStatus(game, ctx) {
//     ctx.fillStyle = 'gold'
//     ctx.font = '20px Orbitron';
//     ctx.fillText('Resources: ' + game.numberOfResources, 175, 20);
//     ctx.fillText('Score: ' + game.score, 175, 38);
//     ctx.fillText('Health: ' + game.health, 175, 56);
//     if (game.gameOver) {
//         ctx.fillStyle = 'black'
//         ctx.font = '90px Orbitron';
//         ctx.fillText('GAME OVER', 135, 330);
//     }

//     if (game.score >= game.winningScore && game.enemies.length === 0) {
//         ctx.fillStyle = 'black'
//         ctx.font = '40px Orbitron';
//         ctx.fillText('Level Complete!', 200, 330);
//         ctx.font = '30px Orbitron';
//         ctx.fillText("You win with: " + game.score + " points!", 245, 360);
//     }
// }