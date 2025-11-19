export class Sheep{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.helmetRadius = 25;
        this.gap = 20;
    }

    draw(ctx) {
        // Helmet circle properties
        const helmetCenterX = this.x + this.width*0.8;
        const helmetCenterY = this.y + this.height*0.2; // Adjust to cover head

        // Body
        ctx.fillStyle = '#ffffffff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // Legs
        const legX = this.width/11;
        ctx.fillRect(this.x + legX, this.y + 50, legX, this.height/5);
        ctx.fillRect(this.x + legX*3, this.y + 50, legX, this.height/5);
        ctx.fillRect(this.x + legX*7, this.y + 50, legX, this.height/5);
        ctx.fillRect(this.x + legX*9, this.y + 50, legX, this.height/5);
        // Face
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 50, this.y + 5, 30, 5);
        ctx.fillRect(this.x + 55, this.y + 2, this.width*0.27, this.height*0.45);
        ctx.fillStyle = '#ffffffff';
        ctx.fillRect(this.x + 60, this.y + 7, 3, 3);
        ctx.fillRect(this.x + 68, this.y + 7, 3, 3);

        // Draw helmet circle (transparent with stroke)
        ctx.beginPath();
        ctx.arc(helmetCenterX, helmetCenterY, this.helmetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'white'; // Helmet outline color
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = 'rgba(42, 66, 110, 0.5)';
        ctx.fill();
    }
}