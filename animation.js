// animation.js

let pIdle = new Image();
pIdle.src = 'models/pIdle.png';

let eIdle = new Image();
eIdle.src = 'models/eIdle.png';

let pRun = new Image();
pRun.src = 'models/pRun.png';

let eRun = new Image();
eRun.src = 'models/eRun.png';

export const scale = 1.6; // Adjusted scale to match player hitbox
export const width = 128;
export const height = 128;
export const scaledWidth = scale * width;
export const scaledHeight = scale * height;

export const cycleLoop = [0, 1, 0, 2];
export let currentLoopIndex = 0;
export let frameCountAnim = 0;


pRun.onload = function() {
    console.log("Playermodel loaded.");
};

eRun.onload = function() {
    console.log("Enemymodel loaded.");
};


// playerImg.onload = function() {
//     console.log("Spritesheet loaded.");
// };

// export function drawFrame(ctx, frameX, frameY, canvasX, canvasY) {
//     ctx.drawImage(playerImg,
//         frameX * width, frameY * height, width, height,
//         canvasX, canvasY, scaledWidth, scaledHeight);
// }y

export function drawPlayerFrame(ctx, frameX, frameY, canvasX, canvasY, player) {
    if (player.isJumping) {

    } else if (player.direction == "left") {
        ctx.save(); // Save the current transformation matrix
        ctx.translate(canvasX + scaledWidth, canvasY); // Move the origin to the top-right corner of the sprite
        ctx.scale(-1, 1); // Scale the context horizontally by -1 to flip the image
        ctx.drawImage(pRun,
            frameX * width, frameY * height, width, height,
            0, 0, scaledWidth, scaledHeight); // Draw the image at the flipped position
        ctx.restore(); // Restore the previous transformation matrix

    } else if (player.direction == "right") {
        ctx.drawImage(pRun,
            frameX * width, frameY * height, width, height,
            canvasX, canvasY, scaledWidth, scaledHeight);
    } else {
        ctx.drawImage(pIdle,
            frameX * width, frameY * height, width, height,
            canvasX, canvasY, scaledWidth, scaledHeight);
    }
}

export function drawEnemyFrame(ctx, frameX, frameY, canvasX, canvasY, enemy) {
    if (enemy.direction == "left") {
        ctx.save(); // Save the current transformation matrix
        ctx.translate(canvasX + scaledWidth, canvasY); // Move the origin to the top-right corner of the sprite
        ctx.scale(-1, 1); // Scale the context horizontally by -1 to flip the image
        ctx.drawImage(eRun,
            frameX * width, frameY * height, width, height,
            0, 0, scaledWidth, scaledHeight); // Draw the image at the flipped position
        ctx.restore(); // Restore the previous transformation matrix

    } else if (enemy.direction == "right") {
        ctx.drawImage(eRun,
            frameX * width, frameY * height, width, height,
            canvasX, canvasY, scaledWidth, scaledHeight);
    } else if (enemy.isJumping) {

    }else {
            ctx.save(); // Save the current transformation matrix
            ctx.translate(canvasX + scaledWidth, canvasY); // Move the origin to the top-right corner of the sprite
            ctx.scale(-1, 1); // Scale the context horizontally by -1 to flip the image
            ctx.drawImage(eIdle,
                frameX * width, frameY * height, width, height,
                0, 0, scaledWidth, scaledHeight); // Draw the image at the flipped position
            ctx.restore(); // Restore the previous transformation matrix
    }
}


export function updateAnimation() {
    if (frameCountAnim >= 20) {  // Adjust the frame rate of the animation here
        frameCountAnim = 0;
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
        }
    }
    frameCountAnim++;
}
