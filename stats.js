import { canvas, ctx, overlay } from "./game.js";

export default class Stats {
    constructor(player, enemies, time) {
        this.player = player;
        this.enemies = enemies
        this.time = time
    }

    draw() {
        ctx.fillStyle = "#FF3131"
        ctx.fillRect(50, 50, canvas.width / 2 - 100, 45)
        this.drawPlayerHealth()
    }


    drawPlayerHealth() {
        let multiplier;
        if (this.player.health > 0 && this.player.health <= 100 ) {
            multiplier = this.player.health / 100
        }else if (this.player.health <= 0 ) {
            multiplier = 0
        }else {
            multiplier = 1
        }

        ctx.fillStyle = "#00bf63"
        // let multiplier = this.player.health > 0 ? this.player.health / 100 : 0
        ctx.fillRect(50, 50, (canvas.width / 2 - 100) * multiplier, 45)
    }

    drawHud(timer) {
            ctx.drawImage(overlay, 0, 35, canvas.width / 2, 75)
            this.drawTime(timer)

    }

    drawTime(timer) {
        let x = canvas.width / 2 - 50;
        let y = 49;
        let width = 100;
        let height = 50;
        let radius = 10;

        // Draw the rounded rectangle
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();

        ctx.fillStyle = "#FFC107";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.fillStyle = "#F6F6F6";
        ctx.font = "50px CustomFont";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((timer / 1000), canvas.width / 2, 75);
    }


    drawStats() {
          
    const text = 'Diagonal Text';
    const x = 500; // x coordinate of where to start the text
    const y = 300; // y coordinate of where to start the text
    const angle = -30; // Angle in degrees to rotate the text

    // Translate to the point where you want to rotate
    ctx.translate(x, y);

    // Convert degrees to radians
    const radians = angle * Math.PI / 180;

    // Rotate the canvas context
    ctx.rotate(radians);

    // Set the text properties
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    
    // Draw the text (after rotation)
    ctx.fillText(text, 0, 0);

    // Reset the transformation matrix to the identity matrix

    }



    update(timer) {
        this.drawTime(timer)
    }
}