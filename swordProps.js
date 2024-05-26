import { enemiesArray, playerArray } from "./game.js"
import { isCollision } from "./helpers.js"
import { createHitParticles } from "./particle.js"
import { gameStart } from "./game.js"
import { playSound } from "./helpers.js"

export default class SwordEntity {
    constructor(width, height, swingDuration, parent, damage){
        this.width = width
        this.height = height
        this.isSwinging = false
        this.swingDuration = swingDuration
        this.swingFrame = 0
        this.parent = parent
        this.damage = damage
    }

    swing(x, y) {
        if (this.parent.type == "player") {
            let enemiesToRemove = []
            enemiesArray.forEach((enemy) => {
                if(isCollision({x: enemy.position.x, y: enemy.position.y, w: enemy.width, h: enemy.height}, {x: x, y: y, w: this.width, h: this.height})){
                    if (enemy.health - this.damage <= 0){
                        enemiesToRemove.push(enemy)
                        enemy.liveState = "death"
                    }
                    enemy.health -= this.damage
                    createHitParticles(enemy.position.x + 30, enemy.position.y + 20)
                    // console.log(enemy)
                }
            })
            setTimeout(() => {
                enemiesToRemove.forEach(e => {
                    const index = enemiesArray.indexOf(e);
                    if (index > -1) {
                        enemiesArray.splice(index, 1);
                        // console.log("THIS IS ENEMEY ARRAY: ", enemiesArray)
                    }
                });
            }, 1000)
        } else if (this.parent.type == "enemy") {
            playerArray.forEach((player) => {
                if(isCollision({x: player.position.x, y: player.position.y, w: player.width, h: player.height}, {x: x, y: y, w: this.width, h: this.height})){
                    playSound("/sounds/knife_stab.mp3", { volume: 0.25 })
                    if (player.health - this.damage <= 0) {
                        player.state = "dying"
                    }
                    createHitParticles(player.position.x + 30, player.position.y + 20)
                    player.health -= this.damage
                }else {
                    playSound("/sounds/knife_slash.wav", { volume: 0.25 })
                }
            })
        }
    }

    draw(x,y) {
        // ctx.fillStyle = "blue"
        // ctx.fillRect(x, y, this.width, this.height);
    }

    update(x,y) {
        this.draw(x,y)
    }


}