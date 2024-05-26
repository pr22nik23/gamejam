import Enemy from "./enemy.js";
import Player from "./player.js";
import Stats from "./stats.js";
import { animate } from "./particle.js";
import { playSound } from "./helpers.js";
let background = new Image()
let enemyImg1 = new Image();
let enemyImg2 = new Image();
export let overlay = new Image()
overlay.src = "/models/overlay4.png"


enemyImg1.src = 'models/enemy1.png'

enemyImg2.src = 'models/enemy3.png'

background.src = 'models/kood-final.png'
background.onload = () => {
    beforeGame()

// startGame()
playSound('/sounds/theme.mp3', { volume: 0.3 })

}
export let gameStart = false;

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const killsElement = document.querySelector(".kills")
export const damageElement = document.querySelector(".damage")
export const levelElement = document.querySelector(".level")
// console.log(killsElement)
const allButtons = document.querySelectorAll('.button')
const restartBUtton = document.querySelector('.restart')
export const endScreen = document.querySelector('.finish')

restartBUtton.addEventListener('click', (event) => {
    window.location.reload()
})


canvas.width = 1024;
canvas.height = 576;

let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;
let timer = 0;


 let currentLevel = 0;

export let playerArray = []
export let enemiesArray = []
        
const keys = {};
const player = new Player({
    position: { x: 50, y: canvas.height - 100 },
    velocity: { x: 5, y: 15 }
});

playerArray.push(player)

// const enemy = new Enemy({
//     position: { x: canvas.width - 100, y: canvas.height - 100 },
//     velocity: { x: 7, y: 20 },
//     props: {
//         type: "enemy1",
//         image: enemyImg1,
//     },
// })


// const enemy1 = new Enemy({
//     position: { x: canvas.width - 100, y: canvas.height - 100 },
//     velocity: { x: 5, y: 20 },
//     props: {
//         type: "enemy2",
//         image: enemyImg2,
//     },
// })

const stats = new Stats(player, enemiesArray)



// enemiesArray.push(enemy, enemy1)

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    allButtons.forEach((button) => {
        if (button.getAttribute('data-value') == e.code){
            button.classList.remove("bg-white")
            button.classList.add('bg-[#0CC0DF]')
        }
    })
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    allButtons.forEach((button) => {
        if (button.getAttribute('data-value') == e.code){
            button.classList.remove("bg-[#0CC0DF]")
            button.classList.add('bg-white')
        }
    })
    if (e.code == 'KeyW') {
        player.jumpCounter++;
        player.wPressed = false
        player.firstJump = true
    }else if (e.code == 'KeyP'){
        let enemy = new Enemy({
            position: { x: canvas.width - 100, y: canvas.height - 100 },
            velocity: { x: 1 + currentLevel + 10, y: 20 },
            props: {
                type: "enemy1",
                image: enemyImg1,
            },
            damage: 5,
            health: 5
        })
        enemiesArray.push(enemy)
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
    ctx.fillStyle = "white"
    ctx.fillStyle = player.color;
    stats.draw();
    stats.drawTime(timer)
    stats.drawHud()
    stats.drawStats()
    // stats.drawHud(timer)
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
    if (currentTime - 10000 - timer >= 1000 && player.state != 'dying') {
        timer += 1000
    }
}

let isSpawning = false
let firstRound = true
function levelLoop() {
    if (enemiesArray.length == 0 && !isSpawning) {
        if (!firstRound){
            playSound(`/sounds/${Math.floor(Math.random() * 5) + 1}.wav`, { volume: 0.8 })
        }
        firstRound= false
        isSpawning = true
        //Give player back little bit of health
        player.health += currentLevel * 10
        player.sword.damage += currentLevel * 2
        //give player speed every 5th round
        levelElement.textContent = `Level: ${currentLevel}`
        currentLevel++
        if(currentLevel % 4 === 0){
            // if (!player.dashCooldown >= 1000){
                player.dashCooldown -= 1000
                displayInfo("Dash cooldown reduced", 3000, "#FFC107")
            // }
        }
        if(currentLevel % 5 === 0){
            player.maxJumps++;
            displayInfo("Max jumps increased", 3000, "#FFC107")
        }
        if (currentLevel % 3 === 0) {
            displayInfo("Speed increase", 3000, "#FFC107")
            player.velocity.x += 1
        }
        setTimeout(() => {
            displayMessage(`LVL ${currentLevel}`, 2000,"#962A45")

        }, 1000)
        setTimeout(() => {
            for(let i = 0; i < currentLevel; i++){
                setTimeout(() => {
                    const randomNumber = Math.random()
                    let enemy;
                    let enemyDMG = 5 + currentLevel * 2
                    let enemyHP = 5 + currentLevel * 5
                    let speed = 1
                    if (randomNumber > 0.9){
                        speed = 3
                    }
                    if (randomNumber < 0.1) {
                        enemyHP += 50
                    }
                    if (randomNumber > 0.5){
                        enemy = new Enemy({
                            position: { x: canvas.width - 100, y: canvas.height - 100 },
                            velocity: { x: 1 + currentLevel +speed, y: 20 },
                            props: {
                                type: "enemy2",
                                image: enemyImg2,
                            },
                            damage: enemyDMG,
                            health: enemyHP
                        })
                    }else {
                        enemy = new Enemy({
                            position: { x: canvas.width - 100, y: canvas.height - 100 },
                            velocity: { x: 1 + currentLevel + speed, y: 20 },
                            props: {
                                type: "enemy1",
                                image: enemyImg1,
                            },
                            damage: enemyDMG,
                            health: enemyHP
                        })
                    }
                    enemiesArray.push(enemy)
                    if (i + 1 == currentLevel) {
                        isSpawning = false
                    }
                }, i * (Math.random() * 4000 + 1000))
            }
        }, 2000)
    }
}

function gameLoop() {
    if (gameStart) {
        
        const startTime = performance.now();
    
        render();
        player.update(keys)
        enemiesArray.forEach((e) => {
            e.update()
            if(player.state == "dying"){
                e.state = "idle"
            }
        })
        stats.update(timer)
        levelLoop()
        enemyLogic()
        calculateFPS()
        calcTimer()
        animate()
        const endTime = performance.now();
        const deltaTime = endTime - startTime;
        const delay = Math.max(0, 1000 / 60 - deltaTime); 
    
        setTimeout(gameLoop, delay);        
    }
}

render()
overlay.onload = () => {
    stats.drawHud(timer)
}



function startGame() {
    requestAnimationFrame(() => {
        lastFrameTime = performance.now();
        gameLoop();
    });
}

function beforeGame() {
    // displayMessage("Genobi: gopnik wars", 2000, "#962A45")
    displayMessage("Defend Ida-Virumaa!", 2000, "#962A45")
    setTimeout(() => {
    displayMessage("May the force be with you!", 2000, "#962A45")

    }, 2500)
    for (let i = 0; i < 10; i++){
        setTimeout(() => {
            if (i == 9) {
                gameStart = true
                playSound('/sounds/fight.wav', { volume: 0.4 })

                startGame()
            }
            if (i >= 5){
                displayMessage(`${10-i}`, 500, "#962A45")
            }
        }, i * 1000)
    }
}


function displayMessage(message, delay, color) {
    const messageContainer = document.createElement("h1");
    messageContainer.textContent = message;
    messageContainer.style.position = "absolute";
    messageContainer.style.zIndex = 50;
    messageContainer.style.fontSize = "72px";

    // Apply transition for smooth appearance and disappearance
    messageContainer.style.transition = "opacity 0.5s ease-in, transform 0.5s ease-out";
    
    document.body.appendChild(messageContainer);

    // Triggering reflow to make the transition work
    void messageContainer.offsetWidth;

    // Apply styles for appearance
    messageContainer.style.opacity = "1";
    messageContainer.style.transform = "translateY(-50%)";
    messageContainer.style.color = color

    // Schedule removal after 2 seconds
    setTimeout(() => {
        // Apply styles for disappearance
        messageContainer.style.opacity = "0";
        messageContainer.style.transform = "translateY(-50%) scale(0.9)";
        
        // Remove the message container after the transition
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 500); // Adjust the timing to match the transition duration
    }, delay);
}

function displayInfo(message, delay, color) {
    const messageContainer = document.createElement("h1");
    messageContainer.textContent = message;
    messageContainer.style.position = "absolute";
    messageContainer.style.zIndex = 50;
    messageContainer.style.fontSize = "45px";

    // Apply transition for smooth appearance and disappearance
    messageContainer.style.transition = "opacity 0.5s ease-in, transform 0.5s ease-out";
    
    document.body.appendChild(messageContainer);

    // Triggering reflow to make the transition work
    void messageContainer.offsetWidth;

    // Apply styles for appearance
    const containerMiddle = document.body.clientWidth / 2
    // console.log(containerMiddle)
    messageContainer.style.opacity = "1";
    messageContainer.style.left = `${containerMiddle - 362}px`
    messageContainer.style.top = "260px"
    messageContainer.style.transform = "translateY(50%)";
    messageContainer.style.color = color

    // Schedule removal after 2 seconds
    setTimeout(() => {
        // Apply styles for disappearance
        messageContainer.style.opacity = "0";
        messageContainer.style.transform = "translateY(-20%) scale(0.9)";
        
        // Remove the message container after the transition
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 500); // Adjust the timing to match the transition duration
    }, delay);
}


// beforeGame()

// // startGame()
// playSound('/sounds/theme.mp3', { volume: 0.3 })
