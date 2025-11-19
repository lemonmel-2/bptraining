import { Sheep } from '../backend/Sheep.js';
import { Asteroid } from '../backend/Asteroid.js';
import { jest } from '@jest/globals';

let soundModule, scriptModule;

//ESM + dynamic imports use unstable_mockModule instead of mock
jest.unstable_mockModule('../backend/sound.js', () => ({
    playGameOverAudio: jest.fn(),
}));

beforeAll(() => {
    document.body.innerHTML = `
        <canvas id="gameCanvas"></canvas>
        <button id="startGame"></button>
        <div id="scoreCounter"></div>
        <input id="music" type="range" />
        <input id="effect" type="range" />
        <audio id="musicAudio"></audio>
        <audio id="gameOverAudio"></audio>
    `;
    const canvas = document.getElementById("gameCanvas");
    canvas.width = 800;
    canvas.height = 300;
    canvas.getContext = jest.fn(()=>({
        clearRect: jest.fn(),
        save: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        drawImage: jest.fn(),
        restore: jest.fn(),
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        arc: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn()
    }))
});

beforeAll(async () => {
    await jest.isolateModulesAsync(async () => {
        scriptModule = await import('../backend/script.js'); 
        soundModule = await import('../backend/sound.js');
    });
});

describe('spawn asteroids', () => {
    test('adds asteroid when length <= 10', () => {
        const asteroids = [];
        scriptModule.spawnAsteroid(asteroids); 
        expect(asteroids.length).toBe(1); 
    });

    test('adds asteroid when length > 10', () => {
        const asteroids = populateAsteroids();
        scriptModule.spawnAsteroid(asteroids); 
        expect(asteroids.length).toBe(11); 
    });
})

describe('sheep movement', () => {
    test('move sheep down', () => {
        const sheep = new Sheep(100,50,800,500);
        scriptModule.moveSheep(sheep, "ArrowDown"); 
        expect(sheep.y).toBe(50+sheep.gap); 
    });

    test('move sheep up', () => {
        const sheep = new Sheep(100,50,800,500);
        scriptModule.moveSheep(sheep, "ArrowUp"); 
        expect(sheep.y).toBe(50-sheep.gap);
    });

    test('move sheep right', () => {
        const sheep = new Sheep(100,50,800,500);
        scriptModule.moveSheep(sheep, "ArrowRight"); 
        expect(sheep.x).toBe(100+sheep.gap);
    });

    test('move sheep left', () => {
        const sheep = new Sheep(100,50,800,500);
        scriptModule.moveSheep(sheep, "ArrowLeft"); 
        expect(sheep.x).toBe(100-sheep.gap);
    });
})

test('increase score', () => {
    let score = 1;
    score = scriptModule.increaseScore(score);
    expect(score).toBe(2);
    expect(document.getElementById("scoreCounter").textContent).toBe('0000001');
});

describe('check collision', () => {
    test('asteroid and sheep on same position', () => {
        const asteroid = new Asteroid(50,50,100,2);
        const sheep = new Sheep(50,50,80,50);
        expect(scriptModule.checkCollision(sheep, asteroid)).toBe(true);
    });

    test('asteroid intersect with sheep side', () => {
        const asteroid = new Asteroid(50,50,20,2);
        const sheep = new Sheep(0,0,100,50);
        expect(scriptModule.checkCollision(sheep, asteroid)).toBe(true);
    });

    test('asteroid and sheep no intersect', () => {
        const asteroid = new Asteroid(100,100,10,2);
        const sheep = new Sheep(0,0,80,50);
        expect(scriptModule.checkCollision(sheep, asteroid)).toBe(false);
    });
})

test('reset game', () => {
    const asteroids = populateAsteroids();
    const sheep = new Sheep(50,50,80,50);
    scriptModule.resetGame(sheep, asteroids);
    expect(asteroids.length).toBe(0);
    expect(sheep.x).toBe(50);
    expect(sheep.y).toBe(150-sheep.height/2);
    expect(soundModule.playGameOverAudio).toHaveBeenCalledTimes(1);
});

test('game loop', async() => {
    const drawSheep = jest.spyOn(Sheep.prototype, 'draw');
    const drawAsteroid = jest.spyOn(Asteroid.prototype, 'draw');
    const rotateAsteroid = jest.spyOn(Asteroid.prototype, 'move');
    const asteroids = populateAsteroids();
    const sheep = new Sheep(50,50,80,50);
    scriptModule.gameLoop(sheep, asteroids, 0, false);
    expect(drawSheep).toHaveBeenCalledTimes(1);
    expect(drawAsteroid).toHaveBeenCalledTimes(11);
    expect(rotateAsteroid).toHaveBeenCalledTimes(11);
});

function populateAsteroids(){
    const asteroids = [];
    for(let i=0; i<=10; i++){
        asteroids.push(new Asteroid(100,100,20,2));
    }
    return asteroids;
}