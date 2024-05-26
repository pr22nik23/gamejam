import { canvas, ctx, damageElement, killsElement, overlay } from "./game.js";

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
        if (this.player.health > 0 && this.player.health <= 100) {
            multiplier = this.player.health / 100
        } else if (this.player.health <= 0) {
            multiplier = 0
        } else {
            multiplier = 1
        }

        ctx.fillStyle = "#00bf63"
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
        ctx.fillText((timer ? timer / 1000 : 0), canvas.width / 2, 75);
    }


    drawStats() {
        const killsText = `Kills:${this.player.kills}`;
        killsElement.textContent = `Kills: ${this.player.kills}`
        const damageText = "Damage:"
        damageElement.textContent = `Damage: ${this.player.totalDamage}`
        const damageNumber = `${this.player.totalDamage}`
        const angle = -7; 


        const radians = angle * Math.PI / 180;
        ctx.rotate(radians);

        ctx.font = '30px CustomFont';
        ctx.fillStyle = '#738256';

        ctx.fillText(killsText, 702, 305);
        ctx.fillText(damageText, 704, 325);
        ctx.fillText(damageNumber, 710, 343);

        ctx.setTransform(1, 0, 0, 1, 0, 0);       
    }



    update(timer) {
        this.drawTime(timer)
    }
}