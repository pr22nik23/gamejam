
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color, gravity, sizeMultiplier) {
        this.x = x;
        this.y = y;
        this.size = (Math.random() * 5 + 2) * sizeMultiplier;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.gravity = gravity;
        this.color = color;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95; // Particles shrink over time
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

const particlesArray = [];

export function createHitParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        particlesArray.push(new Particle(x, y, 'rgba(139, 0, 0, 0.7)', 0.05, 1.5));
    }
}

export function createWalkParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particlesArray.push(new Particle(x, y, 'rgba(77, 93, 98, 1)', -0.1, 0.5));
    }
}

export function animate() {
    particlesArray.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.size < 0.5) {
            particlesArray.splice(index, 1);
        }
    });
}
