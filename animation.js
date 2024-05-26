const scale = 2; // Adjusted scale to match enemy hitbox
const width = 128;
const height = 128.5;
export const scaledWidth = scale * width;
export const scaledHeight = scale * height;


const moveCycle = [0, 1, 2, 3, 4, 5, 6, 7]; // Frames for idle animation
const idleCycle = [0, 1, 2, 3, 4, 5] // Frames for run animation
const attackCycle = [0, 1, 2, 3]; // Frames for attack animation

const jumpCycle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Frames for jump animation
const jumpCycle1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // Frames for jump animation

const deathCycle = [0, 1, 2, 3]; // Frames for jump animation
const hurtCycle = [0, 1]



// export let currentLoopIndex = 0;


const pasahunnik = { "direction": 1000, "swing": 400, "jump": 1000, "death": 1000, "idle": 1000 }

export function drawEnemyFrame(ctx, canvasX, canvasY, enemy, enemyImg) {
    const { cycle, rowOffset } = getAnimationCycle(enemy);

    const frame = cycle[enemy.currentLoopIndex];
    const column = frame % 16;
    const row = rowOffset; // Use the row offset based on the enemy's state

    if (enemy.direction === 'left') {
        ctx.save(); // Save the current transformation matrix
        ctx.translate(canvasX + scaledWidth, canvasY); // Move the origin to the top-right corner of the sprite
        ctx.scale(-1, 1); // Scale the context horizontally by -1 to flip the image
        drawFrame(ctx, enemyImg, column, row, 0, 0);
        ctx.restore(); // Restore the previous transformation matrix
    } else {
        drawFrame(ctx, enemyImg, column, row, canvasX, canvasY);
    }
}


export function drawFrame(ctx, img, frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}


function getAnimationCycle(enemy) {
    if (enemy.liveState == "death") {
        if (enemy.firstDeath) {
            enemy.firstDeath = false
            enemy.currentLoopIndex = 0
        }
        return { cycle: deathCycle, rowOffset: 3, style: "death" };
    }
    if (enemy.state == "idle"){
        return { cycle: idleCycle, rowOffset: 2, style: "idle" };
    }
    if (enemy.sword.isSwinging || !enemy.isStalled) {
        if (enemy.firstSwing) {
            enemy.firstSwing = false
            enemy.currentLoopIndex = 0
        }
        return { cycle: attackCycle, rowOffset: 5, style: "swing" };
    }
    if (enemy.isJumping) {
        if (enemy.firstJump) {
            enemy.firstJump = false
            enemy.currentLoopIndex = 0
        }
        enemy.firstSwing = true
        enemy.firstDirection = true

        return { cycle: jumpCycle, rowOffset: 1, style: "jump" };

    }else if (enemy.direction === "left" || enemy.direction === "right") {
        if (enemy.firstDirection) {
            enemy.firstDirection = false
            enemy.currentLoopIndex = 0
        }
        enemy.firstJump = true
        enemy.firstSwing = true
        return { cycle: moveCycle, rowOffset: 0, style: "direction" };
    }
}


export function updateAnimation(enemy) {
    const { cycle, style } = getAnimationCycle(enemy);

    const t = pasahunnik[style]
    const timePerFrame = t / cycle.length;

    const now = performance.now();

    const elapsed = now - enemy.lastFrame;

    if (elapsed >= timePerFrame) {
        if (!(enemy.currentLoopIndex == 3 && enemy.liveState == "death")){
            enemy.currentLoopIndex++;
        }
        if (enemy.currentLoopIndex >= cycle.length) {
            enemy.currentLoopIndex = 0;
        }

        enemy.lastFrame = now;
    }
}
