import Enemy from "./enemy.js";
import Player from "./player.js";
import Stats from "./stats.js";
import { animate } from "./particle.js";
let background = new Image()
background.src = 'models/kood_level.png'

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;
let timer = 0;

export let playerArray = []
export let enemiesArray = []
        
const keys = {};
const player = new Player({
    position: { x: 50, y: canvas.height - 100 },
    velocity: { x: 7, y: 15 }
});

playerArray.push(player)

const enemy = new Enemy({
    position: { x: canvas.width - 100, y: canvas.height - 100 },
    velocity: { x: 7, y: 20 }
})


const enemy1 = new Enemy({
    position: { x: canvas.width - 100, y: canvas.height - 100 },
    velocity: { x: 5, y: 20 }
})

const stats = new Stats(player, enemiesArray)



enemiesArray.push(enemy, enemy1)

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    if (e.code == 'KeyW') {
        player.jumpCounter++;
        player.wPressed = false
        player.firstJump = true
    }else if (e.code == 'KeyP'){
        console.log("ENEMT ARRAY", enemiesArray)
    }
    let allFalse = true;
    Object.entries(keys).map(([_, value]) => {
        if (value == true) {
            allFalse = false
        }
    })
    if (allFalse) {
        player.direction = "idle"
    }
});



function render() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = player.color;
    stats.draw();
    player.update(keys)
    enemiesArray.forEach((e) => {
        e.update()
    })
    stats.update()
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

    enemiesArray.forEach((e) => {
        e.offence(player, keys)
    })

}

function calcTimer() {
    const currentTime = performance.now()
    if (currentTime - timer >= 1000) {
        timer += 1000
        // console.log(timer)
    }
}

function gameLoop() {
    const startTime = performance.now();

    // console.log("FPS", fps)
    enemyLogic()
    render();
    calculateFPS()
    calcTimer()
    animate()
    const endTime = performance.now();
    const deltaTime = endTime - startTime;
    const delay = Math.max(0, 1000 / 60 - deltaTime); 

    setTimeout(gameLoop, delay);

}


function startGame() {
    requestAnimationFrame(() => {
        lastFrameTime = performance.now();
        gameLoop();
    });
}


startGame()
// playSound('/sounds/testSound.mp3')
