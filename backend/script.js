import { Asteroid } from './Asteroid.js';
import { Sheep } from './Sheep.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// position
let startX = 50;
let startY = canvas.height/2;
let speed = 2;

const asteroid = new Asteroid(canvas.width, 0, 50, speed);
const sheep = new Sheep(startX, startY, 80, 50);


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asteroid.move(canvas);
    asteroid.draw(ctx);
    sheep.draw(ctx);
    requestAnimationFrame(gameLoop);
}

gameLoop();

// canvas.addEventListener('keydown', () => {
//     drawSheep(startX,startY-30);
//     setTimeout(() => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         drawSheep(startX,startY);
//     }, 150);
// });



