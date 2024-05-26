import { canvas, ctx, enemiesArray } from "./game.js"
import SwordEntity from "./swordProps.js"
import { drawPlayerFrame, updateAnimation, scaledWidth, scaledHeight } from "./playerAnimation.js";
import { createWalkParticles, createWindParticles } from "./particle.js";

export default class Player {

    constructor({ position, velocity }) {
        this.type = "player"
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 110
        this.health = 100
        this.isJumping = false;
        this.gravity = 10;
        this.jumpStartTime = 0
        this.jumpDuration = 3500
        this.maxJumps = 2
        this.jumpCounter = 0
        this.groundLevel = canvas.height - this.height; // Assuming the ground is at the bottom of the canvas
        this.sword = new SwordEntity(100, this.height, 10, this, 20)
        this.direction = "idle"
        this.wPressed = false;
        this.dashCooldown = 3000;
        this.dashLastUsed = 0;
        this.dashTimeOutSet = false;
        this.attackCooldown = 500;
        this.firstJump = true
        this.firstSwing = true
        this.firstDirection = true
        this.firstElse = true
        this.firstDying = true
        this.state = "alive"
        this.lastParticle = 0;
    }

    draw() {
        updateAnimation(this);
        // // Adjusting sprite to align with the player hitbox
        const spriteX = this.position.x - (scaledWidth - this.width) / 2; // Centering the sprite horizontally
        const spriteY = this.position.y - (scaledHeight - this.height); // Aligning the sprite vertically
        drawPlayerFrame(ctx, spriteX, spriteY, this);
    }

    update(keys) {
        this.draw()
        if (this.state == "dying"){
            return
        }
        if (keys['KeyA'] && this.position.x > 0) {
            this.direction = "left"
            if(this.position.y >= this.groundLevel){
                if(performance.now() - this.lastParticle >= 200){
                    createWalkParticles(this.position.x, this.position.y + this.height)
                    this.lastParticle = performance.now()
                }
            }
            if(keys['ShiftLeft'] && performance.now() - this.dashLastUsed >= this.dashCooldown){
                if(this.dashTimeOutSet){
                    this.position.x -= 2 * this.velocity.x
                }else {
                    this.dashTimeOutSet = true
                    setTimeout(() => {
                        this.dashLastUsed = performance.now()
                        this.dashTimeOutSet = false
                    }, 200)
                }
            }
            this.position.x -= this.velocity.x;
        }
        if (keys['KeyD'] && this.position.x + this.width < canvas.width) {
            this.direction = "right"
            //dash logic
            if(this.position.y >= this.groundLevel){
                if(performance.now() - this.lastParticle >= 200){
                    createWalkParticles(this.position.x, this.position.y + this.height)
                    this.lastParticle = performance.now()
                }
            }
                if(keys['ShiftLeft'] && performance.now() - this.dashLastUsed >= this.dashCooldown){
                    if(this.dashTimeOutSet){
                        this.position.x += 2 * this.velocity.x
                    }else {
                        this.dashTimeOutSet = true
                        setTimeout(() => {
                            this.dashLastUsed = performance.now()
                            this.dashTimeOutSet = false
                        }, 200)
                    }
                }
            this.position.x += this.velocity.x;
        }
        if (keys['KeyW'] && this.jumpCounter < this.maxJumps && !this.wPressed) {
            this.wPressed = true
            this.isJumping = true
            this.jumpStartTime = performance.now();
            createWindParticles(this.position.x + 20, this.position.y)
            createWindParticles(this.position.x + 40, this.position.y)
        }
        if (keys['Space']) {
            if (!this.sword.isSwinging && this.sword.swingFrame < 1) {
                this.sword.isSwinging = true
                this.sword.swingFrame++;
                if (this.direction == "right") {
                    this.sword.update(this.position.x + this.width, this.position.y )
                    this.sword.swing(this.position.x + this.width, this.position.y )
                } else if (this.direction == "left"){
                    this.sword.update(this.position.x - this.width-60, this.position.y )
                    this.sword.swing(this.position.x - this.width-60, this.position.y )
                }else {
                    let enemy;
                    let lastVal = 99999999
                    enemiesArray.forEach((e) => {
                        if (Math.abs(e.position.x - this.position.x) < lastVal) {
                            enemy = e
                            lastVal = Math.abs(e.position.x - this.position.x)
                        }                        
                    })
                    if(enemy){
                        // Checks if enemy is left or right
                        if (enemy.position.x > this.position.x) {
                            this.sword.update(this.position.x + this.width, this.position.y )
                            this.sword.swing(this.position.x + this.width, this.position.y )
                        } else {
                            this.sword.update(this.position.x - this.width -60, this.position.y )
                            this.sword.swing(this.position.x - this.width -60, this.position.y )
                        }
                    }
                }
                if (this.sword.swingFrame == 1) {
                    setTimeout(() => {
                        this.sword.swingFrame = 0
                        // this.sword.isSwinging = false;
                    }, this.attackCooldown)
                    setTimeout(() => {
                        this.sword.isSwinging = false
                    }, 200)
                }
            }
        }

        if (this.isJumping) {
            const timeElapsed = performance.now() - this.jumpStartTime;
            if (timeElapsed < this.jumpDuration) {

                this.position.y -= this.velocity.y
            }
        }
        if (this.position.y >= this.groundLevel) {
            this.isJumping = false;
            this.jumpCounter = 0;
            this.position.y = canvas.height - this.height
        } else {
            const timeElapsed = performance.now() - this.jumpStartTime;
            const t = timeElapsed / this.jumpDuration;
            let easeOutQuad = 1
            if (timeElapsed < this.jumpDuration) {
                easeOutQuad = t * (15 - t);
            }
            this.position.y += this.gravity * easeOutQuad
        }
    }
}


