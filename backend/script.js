import { Asteroid } from './Asteroid.js';
import { Sheep } from './Sheep.js';
import { playGameOverAudio } from './sound.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGame');
const scoreCounter = document.getElementById('scoreCounter');

// position
const startX = 50;
const startY = canvas.height/2;
const sheepWidth = 80;
const sheepHeight = 50;
const speed = 2;
const asteroids = [];
let score = 0;
let gameOver = false;
let spawnInterval;

const sheep = new Sheep(startX, startY, sheepWidth, sheepHeight);

function spawnAsteroid(){
    if(asteroids.length <=10){
        asteroids.push(new Asteroid(
            canvas.width,
            Math.random()*canvas.height,
            Math.random()*30+30,
            speed
        ));
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asteroids.forEach(asteroid => {
        asteroid.speed *= 1.0003;
        asteroid.move(canvas);
        asteroid.draw(ctx);
        if(checkCollision(sheep, asteroid)){
            gameOver = true;
            console.log("collide!");
        }
    })
    sheep.draw(ctx);
    increaseScore();
    if(!gameOver){
        requestAnimationFrame(gameLoop);
    }else{
        resetGame();
    }
}

function increaseScore(){
    score += 1;
    const formattedScore = score.toString().padStart(10, '0');
    scoreCounter.textContent = formattedScore;
}


function checkCollision(sheep, asteroid) {
    const sheepLeft = sheep.x;
    const sheepRight = sheep.x + sheepWidth;
    const sheepTop = sheep.y;
    const sheepBottom = sheep.y + sheepHeight;

    const asteroidLeft = asteroid.x - asteroid.scale / 2;
    const asteroidRight = asteroid.x + asteroid.scale / 2;
    const asteroidTop = asteroid.y - asteroid.scale / 2;
    const asteroidBottom = asteroid.y + asteroid.scale / 2;

    return (
        sheepLeft < asteroidRight &&
        sheepRight > asteroidLeft &&
        sheepTop < asteroidBottom &&
        sheepBottom > asteroidTop
    );
}

function resetGame(){
    playGameOverAudio();
    asteroids.splice(0, asteroids.length);
    sheep.x = startX;
    sheep.y = startY;
    clearInterval(spawnInterval);
    startButton.style.display = "block";
    startButton.textContent = "start again!";
}

startButton.addEventListener('click', () => {
    score = 0;
    gameOver = false;
    spawnInterval = setInterval(spawnAsteroid, 1000);
    gameLoop();
    startButton.style.display = "none";
})

document.addEventListener('keydown', (event) => { 
    console.log(event.code);
    switch(event.code){
        case "ArrowUp":
            if(sheep.y - 20 >= 10){
                sheep.y -= 20;
            }
            break;
        case "ArrowDown":
            if(sheep.y + 20 <= canvas.height - sheepHeight - 5){
                sheep.y += 20;
            }
            break;
        case "ArrowRight":
            if(sheep.x + 20 <= canvas.width - sheepWidth){
                sheep.x += 20;
            }
            break;
        case "ArrowLeft":
            if(sheep.x - 20 >= 0){
                sheep.x -= 20;
            }
            break;
    }
});



