import { ctx, enemiesArray, playerArray } from "./game.js"
import { isCollision } from "./helpers.js"

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
            enemiesArray.forEach((enemy) => {
                if(isCollision({x: enemy.position.x, y: enemy.position.y, w: enemy.width, h: enemy.height}, {x: x, y: y, w: this.width, h: this.height})){
                    enemy.health -= this.damage
                    console.log(enemy)
                }
            })
        } else if (this.parent.type == "enemy") {
            playerArray.forEach((player) => {
                if(isCollision({x: player.position.x, y: player.position.y, w: player.width, h: player.height}, {x: x, y: y, w: this.width, h: this.height})){
                    player.health -= this.damage
                    console.log(player)
                }
            })
        }
    }

    draw(x,y) {
        ctx.fillStyle = "blue"
        ctx.fillRect(x, y, this.width, this.height);
    }

    update(x,y) {
        this.draw(x,y)
    }


}