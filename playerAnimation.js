let playerImg = new Image();
playerImg.src = 'models/obi.png';

const scale = 2.5; // Adjusted scale to match player hitbox
const width = 100; // Width of each sprite frame
const height = 100.5; // Height of each sprite frame
export const scaledWidth = scale * width;
export const scaledHeight = scale * height;

const idleCycle = [0, 1, 2, 3, 4, 5, 6, 7]; // Frames for idle animation
const moveCycle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Frames for run animation
const attackCycle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Frames for attack animation
const jumpCycle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Frames for jump animation
const deathCycle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // Frames for jump animation

let currentLoopIndex = 0;

const pasahunnik = { "jump": 600, "swing": 100, "direction": 600, "test": 600, "death": 1500 }

playerImg.onload = function () {
    console.log("Playermodel loaded.");
};

// Define a helper function to draw a frame
export function drawFrame(ctx, img, frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

// Function to get the current animation cycle based on the player's state
function getAnimationCycle(player) {
    if (player.state == "dying"){
        if (player.firstDying) {
            console.log("TEST")
            player.firstDying = false
            currentLoopIndex = 0
        }
        return { cycle: deathCycle, rowOffset: 7, style: "death" };

    }
    if (player.sword.isSwinging) {
        if (player.firstSwing) {
            player.firstSwing = false
            currentLoopIndex = 0
        }
        return { cycle: attackCycle, rowOffset: 5, style: "swing" };
    }
    // console.log(player)
    if (player.isJumping) {
        if (player.firstJump) {
            player.firstJump = false
            currentLoopIndex = 0
        }
        player.firstSwing = true
        player.firstDirection = true
        player.firstElse = true
        player.firstDying = true

        return { cycle: jumpCycle, rowOffset: 4, style: "jump" };
    } else if (player.direction === "left" || player.direction === "right") {
        if (player.firstDirection) {
            player.firstDirection = false
            currentLoopIndex = 0
        }
        player.firstJump = true
        player.firstSwing = true
        player.firstElse = true
        player.firstDying = true

        return { cycle: moveCycle, rowOffset: 1, style: "direction" };
    } else {
        if (player.firstElse) {
            player.firstElse = false
            currentLoopIndex = 0
        }
        player.firstJump = true
        player.firstSwing = true
        player.firstDirection = true
        player.firstDying = true
        return { cycle: idleCycle, rowOffset: 0, style: "test" };
    }

}

// Function to draw the player frame
export function drawPlayerFrame(ctx, canvasX, canvasY, player) {
    const { cycle, rowOffset } = getAnimationCycle(player);

    const frame = cycle[currentLoopIndex];
    const column = frame % 16;
    const row = rowOffset; // Use the row offset based on the player's state

    if (player.direction === 'left') {
        ctx.save(); // Save the current transformation matrix
        ctx.translate(canvasX + scaledWidth, canvasY); // Move the origin to the top-right corner of the sprite
        ctx.scale(-1, 1); // Scale the context horizontally by -1 to flip the image
        drawFrame(ctx, playerImg, column, row, 0, 0);
        ctx.restore(); // Restore the previous transformation matrix
    } else {
        drawFrame(ctx, playerImg, column, row, canvasX, canvasY);
    }
}


let lastFrameTime = performance.now()


// Function to update the animation frame
export function updateAnimation(player) {
    const { cycle, style } = getAnimationCycle(player);

    const t = pasahunnik[style]
    const timePerFrame = t / cycle.length;

    const now = performance.now();

    const elapsed = now - lastFrameTime;

    if (elapsed >= timePerFrame) {
        if (!(currentLoopIndex == 15 && player.state == "dying")){
            currentLoopIndex++;
        }
        if (currentLoopIndex >= cycle.length) {
                currentLoopIndex = 0;
        }

        lastFrameTime = now;
    }
}
