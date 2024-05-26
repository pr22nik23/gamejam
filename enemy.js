import { canvas, ctx } from "./game.js"
import SwordEntity from "./swordProps.js"
import { drawEnemyFrame, updateAnimation, scaledWidth, scaledHeight } from "./animation.js";
import { createWalkParticles } from "./particle.js";


export default class Enemy {
    constructor({ position, velocity, props, damage, health }) {
        this.props = props
        this.type = "enemy"
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 110
        this.health = health
        this.isJumping = false;
        this.gravity = 10;
        this.jumpDuration = 3000
        this.maxJumps = 2
        this.jumpCounter = 0
        this.groundLevel = canvas.height - this.height; // Assuming the ground is at the bottom of the canvas
        this.sword = new SwordEntity(80, 10, 10, this, damage)
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
        this.hullumajaState = false;
        this.firstJump = true
        this.firstSwing = true
        this.firstDirection = true
        this.firstElse = true
        this.firstDying = true
        this.isStalled = true
        this.stallCooldown = 400
        this.liveState = "alive"
        this.currentLoopIndex = 0;
        this.lastFrame = 0;
        this.lastParticle = 0;
        this.nearestWall = 'right';
    }

    draw() {
        updateAnimation(this);
        // Adjusting sprite to align with the player hitbox
        const spriteX = this.position.x - (scaledWidth - this.width) / 2; // Centering the sprite horizontally
        const spriteY = this.position.y - (scaledHeight - this.height); // Aligning the sprite vertically
        drawEnemyFrame(ctx, spriteX, spriteY, this, this.props.image);
    }

    update() {
        this.draw()
        if (performance.now() - this.lastJumped >= this.jumpCoolDown) {
            this.lastJumped = performance.now()
            this.isJumping = true
        }
        if (this.state != "idle") {
            this.jump()
            // this.isJumping = false
        } else if (this.state == "idle") {
            this.isJumping = false
            if (this.position.y < this.groundLevel) {
                if (this.position.y + this.velocity.y > this.groundLevel) {
                    this.position.y = this.groundLevel
                }
                this.position.y += this.velocity.y
            } else if (this.position.y > this.groundLevel) {
                if (this.position.y - this.velocity.y < this.groundLevel) {
                    this.position.y = this.groundLevel
                }
                this.position.y -= this.velocity.y
            }
        }
    }


    offence(player, keys) {
        // console.log(this.state)
        player.distanceFromNearestWall = Math.abs(player.position.x - canvas.width)
        player.nearestWall = (player.position.x > canvas.width / 2) ? 'right' : 'left'
        this.nearestWall = (this.position.x > canvas.width / 2) ? 'right' : 'left'

        // console.log("Distance", player.distanceFromNearestWall, "wall", player.nearestWall)
        // console.log(this.state)
        if (this.liveState == "death") {
            this.jumpCoolDown = 99999999999999;
            return
        }
        if (this.position.y >= this.groundLevel) {
            if (performance.now() - this.lastParticle >= 200) {
                createWalkParticles(this.position.x, this.position.y + this.height)
                this.lastParticle = performance.now()
            }
        }
        let pDirection = this.position.x > player.position.x ? 'left' : "right"
        if (performance.now() - this.lastCalcCoords >= 1000) {
            this.randomNumber = Math.random() * 100 + 250;
            this.lastCalcCoords = performance.now()
        }
        if (this.state == "attack") {
            if (player.position.x < this.position.x) {
                if (!this.checkBorder(this.position.x - this.velocity.x)) {

                    this.position.x -= this.velocity.x;
                    this.direction = "left"
                }
            } else {
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    this.position.x += this.velocity.x;
                    this.direction = "right"
                }
            }
            if (Math.abs(player.position.x - this.position.x) < this.sword.width) {
                this.sword.isSwinging = true
                setTimeout(() => {
                    // console.log("YEp this is correct")
                    this.sword.isSwinging = false
                }, 300)
                if (this.direction == "right") {
                    this.sword.update(this.position.x + this.width, this.position.y)
                    this.sword.swing(this.position.x + this.width, this.position.y)
                } else {
                    this.sword.update(this.position.x - this.width, this.position.y)
                    this.sword.swing(this.position.x - this.width, this.position.y)
                }
                if (this.sword.swingFrame == 1) {
                    setTimeout(() => {
                        this.sword.swingFrame = 0
                    }, 1000)
                    setTimeout(() => {
                        this.sword.isSwinging = false
                    }, 200)
                }
                this.lastStrike = performance.now()
                this.stikeCooldown = Math.random() * 5000 + 1000
                this.state = "stall"
            }
        } else if (this.state == "defence") {
            if (performance.now() - this.lastStrike >= this.stikeCooldown) {
                this.state = "attack"
            }
            if (pDirection == "right") {
                if (this.nearestWall == player.nearestWall && player.distanceFromNearestWall > canvas.width - 200 ) {
                    this.state = "forceRight"
                }
                if (!this.checkBorder(this.position.x - this.velocity.x)) {

                    this.position.x -= this.velocity.x
                    this.direction = "left"
                }
            } else {
                if (this.nearestWall == player.nearestWall && player.distanceFromNearestWall < 200) {
                    // this.position.x -= this.velocity.x
                    this.state = "forceLeft"
                }
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    this.position.x += this.velocity.x
                    this.direction = "right"
                }
            }
        } else if (this.state == "forceRight"){
            if (!this.checkBorder(this.position.x +3*this.velocity.x)){
                this.position.x += 3 * this.velocity.x
                this.direction = "right"
            }

        } else if (this.state == "forceLeft") {
            if (!this.checkBorder(this.position.x - 3 * this.velocity.x)) {
                // this.position.x += this.velocity.x
                // this.direction = "right"
                this.position.x -= 3 * this.velocity.x
                this.direction = "left"
            }
        } else if (this.state == "moveLeft") {
            // this.jumpCoolDown = 2000
            if (this.position.x - player.position.x > 200) {
                this.position.x -= 2 * this.velocity.x
                this.direction = "left"

                if (this.forceLeft) {
                    this.forceLeft = false
                    setTimeout(() => {
                        this.state = "hullumaja"
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
                this.position.x -= this.velocity.x
                this.direction = "left"

                if (this.forceLeft) {
                    this.forceLeft = false
                    setTimeout(() => {
                        this.state = "hullumaja"
                        this.forceJump = true;
                        this.forceLeft = true;
                    }, 200)
                }

            }

        } else if (this.state == "moveRight") {
            if (this.position.x - player.position.x < -200) {
                this.position.x += this.velocity.x
                this.direction = "right"
                if (this.forceRight) {
                    this.forceRight = false
                    setTimeout(() => {
                        this.state = "hullumaja"
                        this.forceRight = true;
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
                this.position.x += this.velocity.x
                this.direction = "right"

                if (this.forceRight) {
                    this.forceRight = false
                    setTimeout(() => {
                        this.state = "hullumaja"
                        this.forceJump = true;
                        this.forceRight = true;
                    }, 200)
                }
            }

        } else if (this.state == "hullumaja") {
            if (Math.abs(this.position.x - player.position.x) <= 200) {
                this.state = "defence"
            }
            if (!this.hullumajaState) {
                this.hullumajaState = true
                setTimeout(() => {
                    this.state = "defence"
                    this.hullumajaState = false
                }, 1000)
            }
            if (keys['KeyA']) {
                if (!this.checkBorder(this.position.x - this.velocity.x)) {
                    this.position.x -= this.velocity.x
                    this.direction = "left"
                }
            } else if (keys['KeyD']) {
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    this.position.x += this.velocity.x
                    this.direction = "right"
                }
            }
        } else if (this.state == "stall") {
            if (this.isStalled) {
                this.isStalled = false
                setTimeout(() => {
                    this.isStalled = true
                    this.state = "defence"
                }, this.stallCooldown)
            }
        } else if (this.state == "idle") {
            // console.log("Ja ongi k6ik nii korras")
        } else {
            if (player.position.x < this.position.x && player.position.x + 350 < this.position.x) {
                if (!this.isStriking) {
                    setTimeout(() => {
                        this.state = "attack"
                    }, `${Math.random() * 10000 + 1000}`)
                }
                this.isStriking = true
                // setTimeout(() => {
                // console.log("TIMEOUT")
                if (!this.checkBorder(this.position.x - this.velocity.x)) {
                    // this.position.x -= this.velocity.x;
                    this.state = "moveLeft"

                }
                // }, 450)
            } else {
                if (!this.checkBorder(this.position.x + this.velocity.x)) {
                    // this.position.x += this.velocity.x;
                    this.state = "moveRight"

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
                if (this.position.y - this.velocity.y >= 0) {
                    this.position.y -= this.velocity.y
                    if (this.jumpCounter == 1 && Math.random() > 0.7 || this.doubleJump == true) {
                        setTimeout(() => {
                            if (this.position.y - this.velocity.y >= 0) {

                                this.position.y -= this.velocity.y
                                this.lastJumped = performance.now()
                            }
                        }, Math.random() * 500 + 100)
                    }
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