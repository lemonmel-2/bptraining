export class Asteroid{
    constructor(x, y, scale, speed) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.speed = speed;
        this.asteroidImage = new Image();
        this.asteroidImage.src = "../assets/Asteroid Brown.png";
        this.angle = 0;
    }

    move(canvas){
        this.x -= this.speed;
        if (this.x <= -canvas.width) {
            this.x = canvas.width; // Reset position
        }
        this.angle += 0.01;
    }

    draw(ctx){
        ctx.save(); 
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle); 
        ctx.drawImage(this.asteroidImage, -this.scale/2, -this.scale/2, this.scale, this.scale);
        ctx.restore();
    }
}

