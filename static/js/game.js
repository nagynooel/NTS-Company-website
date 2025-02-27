const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboardInside');
const gameArea = document.querySelector('.game-area');
const loadingScreen = document.getElementById('loadingScreen');
const loadingCanvas = document.getElementById('loadingCanvas');
const loadingCtx = loadingCanvas.getContext('2d');

let loadingSnakeLength = 5; // A kígyó hossza
let loadingSnakePosition = 0; // A kígyó pozíciója
const loadingSnakeSpeed = 2; // A kígyó sebessége

function drawLoadingSnake() {
    loadingCtx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);
    
    // Kígyó rajzolása
    for (let i = 0; i < loadingSnakeLength; i++) {
        loadingCtx.fillStyle = '#4CAF50';
        loadingCtx.beginPath();
        loadingCtx.arc(100 + (loadingSnakePosition + i * 10) % 200, 100, 10, 0, Math.PI * 2);
        loadingCtx.fill();
    }
}

function animateLoadingScreen() {
    loadingSnakePosition += loadingSnakeSpeed;
    drawLoadingSnake();
    requestAnimationFrame(animateLoadingScreen);
}

function hideLoadingScreen() {
    loadingScreen.style.display = 'none';
    initGame(); // Indítsd el a játékot
}

// Indítsd el az animációt
animateLoadingScreen();

// 1,5 másodperc múlva rejtsd el a betöltő képernyőt
setTimeout(hideLoadingScreen, 1500);
// Téma váltó funkció
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const body = document.body;
    if(body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
});

const box = 20;
let snake;
let direction;
let food;
let powerUp; // Power-up változó
let game;
let currentScore = 0;

// Legjobb pontszám kezelése helyesen
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
document.getElementById('bestScore').textContent = bestScore; // Kezdeti érték beállítás

let lastScore = localStorage.getItem('lastScore') || 0;
document.getElementById('lastScore').textContent = lastScore;

function checkScoreboardVisibility() {
    if (!snake || snake.length === 0) return;

    const snakeHead = snake[0];
    const canvasRect = canvas.getBoundingClientRect();
    const scoreboardRect = scoreboard.getBoundingClientRect();

    const snakeX = canvasRect.left + snakeHead.x + box/2;
    const snakeY = canvasRect.top + snakeHead.y + box/2;
    
    const scoreboardCenter = {
        x: scoreboardRect.left + scoreboardRect.width/2,
        y: scoreboardRect.top + scoreboardRect.height/2
    };

    const distance = Math.sqrt(
        Math.pow(snakeX - scoreboardCenter.x, 2) +
        Math.pow(snakeY - scoreboardCenter.y, 2)
    );

    scoreboard.style.opacity = distance < 100 ? '0' : '1';
}

function initGame() {
    const aspectRatio = 1;
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight * 0.6;

    canvas.width = maxWidth > maxHeight ? 
        maxHeight * aspectRatio : 
        maxWidth;
    canvas.height = maxWidth > maxHeight ? 
        maxHeight : 
        maxWidth / aspectRatio;

    snake = [{ 
        x: Math.floor(canvas.width/2/box)*box, 
        y: Math.floor(canvas.height/2/box)*box 
    }];
    direction = '';
    food = generateFood();
    powerUp = null; // Power-up kezdeti érték
    currentScore = 0;
    
    document.getElementById('currentScore').textContent = '0';
    document.getElementById('restartButton').classList.add('hidden');
    document.getElementById('gameOverMessage').classList.add('hidden');
    
    if (game) clearInterval(game);
    game = setInterval(gameLoop, 100);
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function generatePowerUp() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function directionControl(e) {
    const key = e.key.toLowerCase();
    const directions = {
        'w': 'UP',
        's': 'DOWN',
        'a': 'LEFT',
        'd': 'RIGHT'
    };
    
    if (directions[key] && direction !== oppositeDirection(directions[key])) {
        direction = directions[key];
    }
}

function oppositeDirection(dir) {
    const opposites = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
    };
    return opposites[dir];
}

function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kígyó rajzolása
    snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? '#4CAF50' : '#81C784';
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#388E3C';
        ctx.stroke();
    });

    // Étel rajzolása
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    // Power-up rajzolása
    if (powerUp) {
        ctx.fillStyle = '#FFD700'; // Arany szín
        ctx.beginPath();
        ctx.arc(powerUp.x + box / 2, powerUp.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Kígyó mozgása
    const newHead = {...snake[0]};
    switch(direction) {
        case 'UP': newHead.y -= box; break;
        case 'DOWN': newHead.y += box; break;
        case 'LEFT': newHead.x -= box; break;
        case 'RIGHT': newHead.x += box; break;
    }

    // Kígyó és étel ütközése
    if (newHead.x === food.x && newHead.y === food.y) {
        currentScore++;
        document.getElementById('currentScore').textContent = currentScore;
        food = generateFood();
    } else {
        snake.pop();
    }

    // Kígyó és power-up ütközése
    if (powerUp && newHead.x === powerUp.x && newHead.y === powerUp.y) {
        currentScore += 2; // Például 2 pontot ad a power-up
        document.getElementById('currentScore').textContent = currentScore;
        powerUp = null; // Eltávolítjuk a power-up-ot
        clearInterval(game); // Megállítjuk a játékot
        game = setInterval(gameLoop, 80); // Növeljük a sebességet
    }

    // Játék vége ellenőrzése
    if (newHead.x < 0 || newHead.x >= canvas.width ||
        newHead.y < 0 || newHead.y >= canvas.height ||
        collision(newHead, snake)) {
        endGame();
        return;
    }

    snake.unshift(newHead);
    checkScoreboardVisibility();

    // Power-up generálása 10 másodpercenként
    if (!powerUp && Math.random() < 0.1) { // 10% eséllyel generálunk power-up-ot
        powerUp = generatePowerUp();
    }
}

function endGame() {
    clearInterval(game);
    lastScore = currentScore;
    localStorage.setItem('lastScore', lastScore.toString());
    document.getElementById('lastScore').textContent = lastScore;

    if (currentScore > bestScore) {
        bestScore = currentScore;
        localStorage.setItem('bestScore', bestScore.toString());
        document.getElementById('bestScore').textContent = bestScore;
    }

    document.getElementById('restartButton').classList.remove('hidden');
    document.getElementById('gameOverMessage').classList.remove('hidden');
}

function adjustContainer() {
    const container = document.getElementById('container');
    if(window.innerWidth <= 768){
        container.style.margin = '60px 20px 20px 20px';
    } 
    else{
        container.style.margin = '20px';
    }
}

document.addEventListener('keydown', directionControl);
document.getElementById('restartButton').addEventListener('click', initGame);
window.addEventListener('resize', adjustContainer);
adjustContainer();

initGame();