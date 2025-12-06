import { recordScore } from './api.js';
import { Asteroid } from './object/Asteroid.js';
import { Sheep } from './object/Sheep.js';
import { formatScore } from './setup.js';
import { playGameOverAudio } from './sound.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startGame');
const scoreCounter = document.getElementById('scoreCounter');
const highestScore = document.getElementById('highestScore');
const openLogin  = document.getElementById('openAuthModal');

// initialization attributes
const sheepWidth = 80;
const sheepHeight = 50;
const startX = 50;
const startY = canvas.height/2 - sheepHeight/2;
const speed = 2.1;
const speedIncrement = 1.0003;
const asteroids = [];

// dynamic attributes
let spawnInterval;

const sheep = new Sheep(startX, startY, sheepWidth, sheepHeight);

// add asteroid to asteroids list
function spawnAsteroid(asteroids){
    if(asteroids.length <=10){
        asteroids.push(new Asteroid(
            canvas.width,
            Math.random()*canvas.height,
            Math.random()*30+30,
            speed
        ));
    }
}

// main game function animation loop
function gameLoop(sheep, asteroids, score, gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asteroids.forEach(asteroid => {
        asteroid.speed *= speedIncrement;
        asteroid.move(canvas);
        asteroid.draw(ctx);
        if(checkCollision(sheep, asteroid)){
            gameOver = true;
            console.log("collide!");
        }
    })
    sheep.draw(ctx);
    score = increaseScore(score);
    if(!gameOver){
        requestAnimationFrame(() => gameLoop(sheep, asteroids, score, gameOver));
    }else{
        recordNewScore(score);
        resetGame(sheep, asteroids);
    }
}

// update score counter
function increaseScore(score){
    scoreCounter.textContent = formatScore(score);
    return score + 1;
}

// check asteroid body intersect with sheep body
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

async function recordNewScore(score){
    try{
        const data = await recordScore(score);
        console.log(data);
        if(data == true){
            highestScore.innerHTML = formatScore(score);
        }
    } catch (err) {
        console.error("Failed to record score:", err);
    }
}

// reset all objects to init point
function resetGame(sheep, asteroids){
    playGameOverAudio();
    asteroids.splice(0, asteroids.length);
    sheep.x = startX;
    sheep.y = startY;
    clearInterval(spawnInterval); //renew interval
    startButton.style.display = "block";
    startButton.textContent = "start again!";
}

// start game trigger point
startButton.addEventListener('click', () => {
    let score = 0;
    spawnInterval = setInterval(() => spawnAsteroid(asteroids), 1000);
    gameLoop(sheep, asteroids, score, false);
    startButton.style.display = "none";
})

// sheep movement
document.addEventListener('keydown', (event) => { 
    moveSheep(sheep, event.code);
});

function moveSheep(sheep, direction){
    const space = sheep.gap;
    switch(direction){
        case "ArrowUp":
            if(sheep.y - space >= sheep.helmetRadius/2){
                sheep.y -= space;
            }
            break;
        case "ArrowDown":
            if(sheep.y + space <= canvas.height - sheepHeight - space){
                sheep.y += space;
            }
            break;
        case "ArrowRight":
            if(sheep.x + space <= canvas.width - sheepWidth){
                sheep.x += space;
            }
            break;
        case "ArrowLeft":
            if(sheep.x - space >= 0){
                sheep.x -= space;
            }
            break;
    }
}

export {spawnAsteroid, moveSheep, increaseScore, checkCollision, resetGame, gameLoop};