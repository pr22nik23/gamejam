import { canvas, ctx } from "./game.js"
import SwordEntity from "./swordProps.js"
import { drawPlayerFrame, updateAnimation, cycleLoop, currentLoopIndex, scaledWidth, scaledHeight } from "./animation.js";


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
        this.sword = new SwordEntity(50, 10, 10, this, 20)
        this.direction = "idle"
        this.wPressed = false;
        this.aPressCounter = 0;
        this.dPressCounter = 0;
        this.dashCooldown = 3000;
        this.dashLastUsed = 0;

    }

    draw() {
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        updateAnimation();
        // // Adjusting sprite to align with the player hitbox
        const spriteX = this.position.x - (scaledWidth - this.width) / 2; // Centering the sprite horizontally
        const spriteY = this.position.y - (scaledHeight - this.height); // Aligning the sprite vertically
        drawPlayerFrame(ctx, cycleLoop[currentLoopIndex], 0, spriteX, spriteY, this);
    }

    update(keys) {
        this.draw()
        if (keys['KeyA'] && this.position.x > 0) {
            this.direction = "left"
            if (this.aPressCounter >= 1) {
                console.log("Test")
                this.position.x -= 2 * this.velocity.x
            }
            this.position.x -= this.velocity.x;
        }
        if (keys['KeyD'] && this.position.x + this.width < canvas.width) {
            this.direction = "right"
            if (this.dPressCounter >= 1) {
                this.position.x += 2 * this.velocity.x
            }
            this.position.x += this.velocity.x;
        }
        if (keys['KeyW'] && this.jumpCounter < this.maxJumps && !this.wPressed) {
            this.wPressed = true
            this.isJumping = true
            this.jumpStartTime = performance.now();
        }
        if (keys['Space']) {
            if (!this.sword.isSwinging || this.sword.swingFrame < 1) {
                this.sword.isSwinging = true
                this.sword.swingFrame++;
                if (this.direction == "right") {
                    this.sword.update(this.position.x + this.width, this.position.y + this.height / 2)
                    this.sword.swing(this.position.x + this.width, this.position.y + this.height / 2)
                } else {
                    this.sword.update(this.position.x - this.width, this.position.y + this.height / 2)
                    this.sword.swing(this.position.x - this.width, this.position.y + this.height / 2)

                }
                if (this.sword.swingFrame == 1) {
                    setTimeout(() => {
                        this.sword.swingFrame = 0
                    }, 1000)
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


