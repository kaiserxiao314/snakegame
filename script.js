const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverModal = document.getElementById('game-over-modal');

// Grid constants
const ROWS = 10;
const COLS = 70;
let cellSize;

// Game state
let snake = [];
let food = null;
let fallingShapes = [];
let spawnTimer = 0;
const SPAWN_COOLDOWN = 15; // Ticks between spawns
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let highScore = localStorage.getItem('snake-high-score') || 0;
let gameLoop = null;
let speed = 100;
let isPlaying = false;

// Colors
const COLORS = {
    snakeHead: '#00ffaa',
    snakeBody: '#00cc88',
    food: '#ff0077',
    square: '#7000ff',
    triangle: '#ffaa00',
    gridLine: 'rgba(255, 255, 255, 0.05)'
};

function init() {
    resize();
    highScoreElement.textContent = highScore.toString().padStart(3, '0');
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeydown);
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
}

function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    cellSize = Math.floor(rect.width / COLS);
    canvas.width = COLS * cellSize;
    canvas.height = ROWS * cellSize;

    if (!isPlaying) drawPlaceholder();
}

function drawPlaceholder() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

function drawGrid() {
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
}

function startGame() {
    isPlaying = true;
    score = 0;
    direction = 'right';
    nextDirection = 'right';
    speed = 100;
    spawnTimer = 0;
    fallingShapes = [];
    scoreElement.textContent = '000';
    gameOverModal.classList.add('hidden');
    startBtn.style.display = 'none';

    // Initialize snake in the middle
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];

    spawnFood();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, speed);
}

function spawnFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
        const isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
        const isOnShape = fallingShapes.some(s => Math.floor(s.x) === food.x && Math.floor(s.y) === food.y);
        if (!isOnSnake && !isOnShape) break;
    }
}

function spawnShape() {
    const type = Math.random() > 0.5 ? 'square' : 'triangle';
    fallingShapes.push({
        x: Math.floor(Math.random() * COLS),
        y: -1,
        type: type,
        speed: 0.2 + (Math.random() * 0.3) // Vertical speed per tick
    });
}

function handleKeydown(e) {
    const key = e.key.toLowerCase();
    if ((key === 'arrowup' || key === 'w') && direction !== 'down') nextDirection = 'up';
    if ((key === 'arrowdown' || key === 's') && direction !== 'up') nextDirection = 'down';
    if ((key === 'arrowleft' || key === 'a') && direction !== 'right') nextDirection = 'left';
    if ((key === 'arrowright' || key === 'd') && direction !== 'left') nextDirection = 'right';
}

function update() {
    direction = nextDirection;
    const head = { ...snake[0] };

    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;
    if (direction === 'left') head.x--;
    if (direction === 'right') head.x++;

    // Snake collision with walls or self
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    // Update falling shapes
    spawnTimer++;
    if (spawnTimer >= SPAWN_COOLDOWN) {
        spawnShape();
        spawnTimer = 0;
    }

    for (let i = fallingShapes.length - 1; i >= 0; i--) {
        const shape = fallingShapes[i];
        shape.y += shape.speed;

        // Check collision with snake head
        const sx = Math.floor(shape.x);
        const sy = Math.floor(shape.y);

        if (snake.some(seg => seg.x === sx && seg.y === sy)) {
            endGame();
            return;
        }

        // Remove if out of bounds
        if (shape.y > ROWS) {
            fallingShapes.splice(i, 1);
        }
    }

    snake.unshift(head);

    // Food check
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score.toString().padStart(3, '0');
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore.toString().padStart(3, '0');
            localStorage.setItem('snake-high-score', highScore);
        }
        spawnFood();
        if (speed > 50) {
            clearInterval(gameLoop);
            speed -= 0.5;
            gameLoop = setInterval(update, speed);
        }
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    // Draw falling shapes
    fallingShapes.forEach(shape => {
        ctx.fillStyle = COLORS[shape.type];
        ctx.shadowBlur = 10;
        ctx.shadowColor = COLORS[shape.type];

        const px = shape.x * cellSize + 2;
        const py = shape.y * cellSize + 2;
        const size = cellSize - 4;

        if (shape.type === 'square') {
            ctx.fillRect(px, py, size, size);
        } else {
            ctx.beginPath();
            ctx.moveTo(px + size / 2, py);
            ctx.lineTo(px + size, py + size);
            ctx.lineTo(px, py + size);
            ctx.closePath();
            ctx.fill();
        }
    });

    // Draw snake
    ctx.shadowBlur = 0; // Reset shadow for body
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snakeBody;
        if (index === 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = COLORS.snakeHead;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        const padding = 2;
        ctx.roundRect(
            segment.x * cellSize + padding,
            segment.y * cellSize + padding,
            cellSize - padding * 2,
            cellSize - padding * 2,
            4
        );
        ctx.fill();
    });

    // Draw food
    ctx.fillStyle = COLORS.food;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.food;
    ctx.beginPath();
    ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function endGame() {
    isPlaying = false;
    clearInterval(gameLoop);
    finalScoreElement.textContent = score;
    gameOverModal.classList.remove('hidden');
}

init();
