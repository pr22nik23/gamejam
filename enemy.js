import { canvas, ctx, enemiesArray, playerArray } from "./game.js"
import SwordEntity from "./swordProps.js"
import { drawEnemyFrame, updateAnimation, cycleLoop, currentLoopIndex, scaledWidth, scaledHeight } from "./animation.js";


export default class Enemy {
    constructor({ position, velocity }) {
        this.type = "enemy"
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 110
        this.health = 100
        this.isJumping = false;
        this.gravity = 10;
        this.jumpDuration = 2000
        this.maxJumps = 2
        this.jumpCounter = 0
        this.groundLevel = canvas.height - this.height; // Assuming the ground is at the bottom of the canvas
        this.sword = new SwordEntity(50, 10, 10, this, 10)
        this.direction = "right"
        this.wPressed = false;
        this.aPressCounter = 0;
        this.dPressCounter = 0;
        this.dashCooldown = 3000;
        this.dashLastUsed = 0;
        //defence, offence, attack 
        this.state = "offence";
        this.isStriking = false;
        this.lastCalcCoords = 0;
        this.randomNumber = Math.random() * 100 + 350;
        this.lastStrike = 0;
        this.stikeCooldown = 0;
        this.lastJumped = 0;
        this.jumpCoolDown = 3000;
        this.forceJump = true;
        this.forceLeft = true;
        this.forceRight = true;
        this.doubleJump = false;
    }

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        updateAnimation();
        // Adjusting sprite to align with the player hitbox
        const spriteX = this.position.x - (scaledWidth - this.width) / 2; // Centering the sprite horizontally
        const spriteY = this.position.y - (scaledHeight - this.height); // Aligning the sprite vertically
        drawEnemyFrame(ctx, cycleLoop[currentLoopIndex], 0, spriteX, spriteY);
    }

    update() {
        this.draw()
        if (performance.now() - this.lastJumped >= this.jumpCoolDown) {
            this.lastJumped = performance.now()
            this.isJumping = true
            console.log("Jumped")
        }
        this.jump()
    }

    defence() {

    }

    offence(player) {
        let direction = this.position.x > player.position.x ? 'left' : "right"
        // console.log(direction)
        console.log(this.state)
        // let rNumber = Math.random() * 100 + 350
        if (performance.now() - this.lastCalcCoords >= 1000) {
            // console.log("THIS IS TEST")
            this.randomNumber = Math.random() * 100 + 250;
            this.lastCalcCoords = performance.now()
        }
        if (this.state == "attack") {
            // console.log("YEP ITS OVER FOR YA")
            if (player.position.x < this.position.x) {
                if (!this.checkBorder(this.position.x - this.velocity.x)) {

                    this.position.x -= this.velocity.x;
                }
            } else {
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    this.position.x += this.velocity.x;

                }
            }
            if (Math.abs(player.position.x - this.position.x) < this.sword.width - 10) {
                // console.log("YEP YOU ARE DED MY FRIEND")
                this.sword.swing(this.position.x, this.position.y)
                this.lastStrike = performance.now()
                this.stikeCooldown = Math.random() * 5000 + 1000
                this.state = "defence"
            }
        } else if (this.state == "defence") {
            if (performance.now() - this.lastStrike >= this.stikeCooldown) {
                this.state = "attack"
            }
            if (direction == "right") {
                if (!this.checkBorder(this.position.x - this.velocity.x)) {
                    this.position.x -= this.velocity.x
                }
            } else {
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    this.position.x += this.velocity.x
                }
            }
        } else if (this.state == "moveLeft") {
            // this.jumpCoolDown = 2000
            if (this.position.x - player.position.x > 200) {
                this.position.x -= this.velocity.x
                if (this.forceLeft) {
                    this.forceLeft = false
                    setTimeout(() => {
                        this.state = "defence"
                        this.forceLeft = true;
                    }, 1000)
                }
            } else {
                if (this.forceJump) {
                    this.doubleJump = true
                    this.lastJumped = performance.now()
                    this.isJumping = true
                    this.forceJump = false
                    this.doubleJump = false
                }
                this.position.x -=  this.velocity.x
                if (this.forceLeft){
                    this.forceLeft = false
                    setTimeout(() => {
                        this.state = "defence"
                        this.forceJump = true;
                        this.forceLeft = true;
                    }, 200)
                }

            }

            // if (this.position.x ) 

        } else if (this.state == "moveRight") {
            if (this.position.x - player.position.x < 200) {
                this.position.x += this.velocity.x
                if (this.forceRight) {
                    this.forceRight = false
                    setTimeout(() => {
                        this.state = "defence"
                        this.forceRight = true;
                    }, 1000)
                }
            }else {
                if (this.forceJump) {
                    this.doubleJump = true
                    this.lastJumped = performance.now()
                    this.isJumping = true
                    this.forceJump = false
                    this.doubleJump = false
                }
                this.position.x += this.velocity.x
                if (this.forceRight){
                    this.forceRight = false
                    setTimeout(() => {
                        this.state = "defence"
                        this.forceJump = true;
                        this.forceRight = true;
                    }, 200)
                }
            }

        } else {
            if (player.position.x < this.position.x && player.position.x + 350 < this.position.x) {
                if (!this.isStriking) {
                    setTimeout(() => {
                        console.log("Striking")
                        this.state = "attack"
                    }, `${Math.random() * 10000 + 1000}`)
                }
                this.isStriking = true
                // setTimeout(() => {
                // console.log("TIMEOUT")
                if (!this.checkBorder(this.position.x - this.velocity.x)) {
                    this.position.x -= this.velocity.x;
                }
                // }, 450)
            } else {
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    this.position.x += this.velocity.x;
                }
            }

        }
    }

    checkBorder(x) {
        if (x + this.width > canvas.width) {
            this.state = "moveLeft"
            return true
        } else if (x < 0) {
            this.state = "moveRight"

        } else {
            return false
        }
    }


    jump() {
        if (this.isJumping) {
            const timeElapsed = performance.now() - this.lastJumped;
            if (timeElapsed < this.jumpDuration) {
                this.jumpCounter++;

                this.position.y -= this.velocity.y
                if (this.jumpCounter == 1 && Math.random() > 0.7 || this.doubleJump == true) {
                    console.log("Doulbe jump")
                    setTimeout(() => {
                        this.position.y -= this.velocity.y
                        this.lastJumped = performance.now()

                    }, Math.random() * 500 + 100)
                }
            }
        }
        if (this.position.y >= this.groundLevel) {
            this.isJumping = false;
            this.jumpCounter = 0;
            this.position.y = canvas.height - this.height
        } else {
            const timeElapsed = performance.now() - this.lastJumped;
            const t = timeElapsed / this.jumpDuration;
            let easeOutQuad = 1
            if (timeElapsed < this.jumpDuration) {
                easeOutQuad = t * (15 - t);
            }
            this.position.y += this.gravity * easeOutQuad
        }
    }
}