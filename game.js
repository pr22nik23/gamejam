import { currentLoopIndex, cycleLoop } from "./animation.js"; // Importing animation functions and variables
import Enemy from "./enemy.js";
import Player from "./player.js";
let background = new Image()
background.src = 'models/vector-mountain-illustration-game-background_303920-21.avif'

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

export let playerArray = []
export let enemiesArray = []

const playerHealthText = document.querySelector("#playerHealth")
const enemyHealthText = document.querySelector("#enemyHealth")

const keys = {};
const player = new Player({
    position: { x: 50, y: canvas.height - 100 },
    velocity: { x: 7, y: 20 }
});

playerArray.push(player)

const enemy = new Enemy({
    position: { x: canvas.width - 100, y: canvas.height - 100 },
    velocity: { x: 7, y: 20 }
})

enemiesArray.push(enemy)

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    let currentTime = performance.now()

    keys[e.code] = false;
    if (e.code == 'KeyW') {
        player.jumpCounter++;
        player.wPressed = false
    } else if (e.code == "KeyA") {
        if (currentTime - player.dashLastUsed >= player.dashCooldown) {
            player.aPressCounter++;
            setTimeout(() => {
                player.aPressCounter = 0;
                player.dashLastUsed = performance.now()

            }, 250)
        }
    } else if (e.code == "KeyD") {
        if (currentTime - player.dashLastUsed >= player.dashCooldown) {
            player.dPressCounter++;
            setTimeout(() => {
                player.dPressCounter = 0;
                player.dashLastUsed = performance.now()
            }, 250)
        }
    }
    let allFalse = true;
    Object.entries(keys).map(([_, value]) => {
        if (value == true){
            allFalse = false
        }
    })
    if (allFalse) {
        player.direction = "idle"
    }
});



function render() {
    // ctx.fillStyle = "grey"
    // ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = player.color;
    player.update(keys)
    enemy.update()
    playerHealthText.innerHTML = `${player.health}`
    enemyHealthText.innerHTML = `${enemy.health}`

    // // Draw Player 1's Sword
    // if (player.sword.isSwinging) {
    //     const sword1X = player.x + player.width;
    //     const sword1Y = player.y + (player.height / 2) - (player.sword.height / 2);
    //     ctx.fillStyle = 'silver';
    //     ctx.fillRect(sword1X, sword1Y, player.sword.width, player.sword.height);
    // }


}

function calculateFPS() {
    const currentTime = performance.now();
    frameCount++;
    if (currentTime - lastFrameTime >= 1000) { // Update FPS every second
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = currentTime;
    }
}

function enemyLogic() {
    // if (Math.abs(player.position.x - enemy.position.x) <= 150){
        // enemy.state = "defence"
        // enemy.defence()
    // }else {
        // enemy.state = "attack"
        enemy.offence(player, keys)
    // }

    // console.log(enemy.state)
}

function gameLoop() {
    const startTime = performance.now();

    enemyLogic()
    render();
    calculateFPS()

    const endTime = performance.now();
    const deltaTime = endTime - startTime;
    const delay = Math.max(0, 1000 / 60 - deltaTime); // Adjust to target 60 FPS

    setTimeout(gameLoop, delay);

}


function startGame() {
    requestAnimationFrame(() => {
        lastFrameTime = performance.now();
        gameLoop();
    });
}


startGame()
// img.onload = init;