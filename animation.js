const scale = 2; 
const width = 128;
const height = 128.5;
export const scaledWidth = scale * width;
export const scaledHeight = scale * height;


const moveCycle = [0, 1, 2, 3, 4, 5, 6, 7]; 
const idleCycle = [0, 1, 2, 3, 4, 5] 
const attackCycle = [0, 1, 2, 3]; 

const jumpCycle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; 
const jumpCycle1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; 

const deathCycle = [0, 1, 2, 3]; 
const hurtCycle = [0, 1]

const pasahunnik = { "direction": 1000, "swing": 400, "jump": 1000, "death": 1000, "idle": 1000 }

export function drawEnemyFrame(ctx, canvasX, canvasY, enemy, enemyImg) {
    const { cycle, rowOffset } = getAnimationCycle(enemy);

    const frame = cycle[enemy.currentLoopIndex];
    const column = frame % 16;
    const row = rowOffset; 

    if (enemy.direction === 'left') {
        ctx.save(); 
        ctx.translate(canvasX + scaledWidth, canvasY); 
        ctx.scale(-1, 1); 
        drawFrame(ctx, enemyImg, column, row, 0, 0);
        ctx.restore(); 
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
