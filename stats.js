import { canvas, ctx } from "./game.js";

export default class Stats {
    constructor(player, enemies, time) {
        this.player = player;
        this.enemies = enemies
        this.time = time
    }

    draw() {
        ctx.fillStyle = "red"
        // console.log(canvas.width)
        ctx.fillRect(50, 50, canvas.width / 2 - 100, 50)
        // ctx.fillRect(50, 50, canvas.width /2 - 100 , 50)
        ctx.fillStyle = "red"
        ctx.fillRect((canvas.width / 2) + 50, 50, canvas.width / 2 - 100, 50)
    }


    drawPlayerHealth() {
        let multiplier = this.player.health > 0 ? this.player.health / 100 : 0
        ctx.fillStyle = "blue"
        ctx.fillRect(50, 50, (canvas.width / 2 - 100) * multiplier, 50)
    }

    drawEnemyHealth() {
        const enemyHealth = this.enemies.reduce((total, enemy) => total + enemy.health, 0);
        let multiplier = enemyHealth / 100
        let start = multiplier == 1 ? multiplier * (canvas.width / 2 - 300) : 0
        ctx.fillStyle = "blue"
        ctx.fillRect(canvas.width / 2 + 50 + start, 50, (canvas.width / 2 - 300) * multiplier, 50)
    }



    update() {
        this.drawPlayerHealth()
        this.drawEnemyHealth()
    }
}