const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird
let bird = { x: 60, y: 300, w: 34, h: 24, gravity: 0.25, lift: -4.5, velocity: 0 };

// Pipes
let pipes = [];
let pipeWidth = 52;
let pipeGap = 120;
let frame = 0;
let score = 0;
let gameOver = false;

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
}

function drawBird() {
    // === 새의 중심 좌표 ===
    const cx = bird.x + bird.w / 2;
    const cy = bird.y + bird.h / 2;
    // === 날개 ===
    let wingAngle = Math.sin(frame / 4) * 0.7 - 0.3; // 펄럭임
    let wingLength = bird.h * 2; // 몸통의 2배
    let wingWidth = bird.h * 0.6;
    // 왼쪽(아래) 날개
    ctx.save();
    ctx.translate(cx, cy + 2);
    ctx.rotate(wingAngle - 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, wingLength, wingWidth, Math.PI * 1.08, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.globalAlpha = 0.82;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.closePath();
    ctx.restore();
    // 오른쪽(위) 날개
    ctx.save();
    ctx.translate(cx, cy + 2);
    ctx.rotate(-wingAngle + 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, wingLength, wingWidth, Math.PI * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.globalAlpha = 0.82;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.closePath();
    ctx.restore();

    // === 몸통 (하얀 타원) ===
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, bird.h * 0.9, bird.h * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#bbb';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // === 머리 (진행방향, 오른쪽) ===
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx + bird.h * 0.7, cy - bird.h * 0.22, bird.h * 0.38, bird.h * 0.38, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#eee';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // === 눈 (크고 하얀색) ===
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx + bird.h * 0.9, cy - bird.h * 0.22, bird.h * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ccc';
    ctx.shadowBlur = 2;
    ctx.fill();
    ctx.closePath();
    // 검은 동공
    ctx.beginPath();
    ctx.arc(cx + bird.h * 0.97, cy - bird.h * 0.22, bird.h * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // === 부리 (빨간 삼각형, 오른쪽 뾰족) ===
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx + bird.h * 1.15, cy - bird.h * 0.18);
    ctx.lineTo(cx + bird.h * 1.32, cy - bird.h * 0.12);
    ctx.lineTo(cx + bird.h * 1.15, cy);
    ctx.fillStyle = '#e74c3c';
    ctx.shadowColor = '#c0392b';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // === 꼬리 (왼쪽, 3갈래 깃털) ===
    let tailBaseX = cx - bird.h * 0.95;
    let tailBaseY = cy + bird.h * 0.1;
    for (let i = -1; i <= 1; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailBaseX, tailBaseY + i * 5);
        ctx.quadraticCurveTo(
            tailBaseX - bird.h * 0.38,
            tailBaseY + i * 10 - 8 * i,
            tailBaseX - bird.h * 0.7,
            tailBaseY + i * 12 - 10 * i
        );
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 4 - Math.abs(i);
        ctx.shadowColor = '#5dade2';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}


function drawPipes() {
    pipes.forEach(pipe => {
        // 위쪽 파이프: 고드름(얼음) 모양
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pipe.x, 0);
        ctx.lineTo(pipe.x + pipeWidth, 0);
        ctx.lineTo(pipe.x + pipeWidth, pipe.top - 18);
        // 고드름 삼각형들
        let icicleCount = Math.floor(pipeWidth / 10);
        for (let i = 0; i < icicleCount; i++) {
            let x1 = pipe.x + i * (pipeWidth / icicleCount);
            let x2 = pipe.x + (i + 1) * (pipeWidth / icicleCount);
            let mid = (x1 + x2) / 2;
            ctx.lineTo(mid, pipe.top - 2 + Math.random() * 12);
            ctx.lineTo(x2, pipe.top - 18);
        }
        ctx.lineTo(pipe.x, pipe.top - 18);
        ctx.closePath();
        ctx.fillStyle = '#b3e6ff';
        ctx.strokeStyle = '#7fd7ff';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 아래쪽 파이프: 나무 기둥 모양
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pipe.x, pipe.top + pipeGap);
        ctx.lineTo(pipe.x + pipeWidth, pipe.top + pipeGap);
        ctx.lineTo(pipe.x + pipeWidth, canvas.height);
        ctx.lineTo(pipe.x, canvas.height);
        ctx.closePath();
        ctx.fillStyle = '#a0522d';
        ctx.fill();
        // 나무결 무늬
        for (let y = pipe.top + pipeGap + 10; y < canvas.height; y += 16) {
            ctx.beginPath();
            ctx.moveTo(pipe.x + 8, y);
            ctx.lineTo(pipe.x + pipeWidth - 8, y + 6);
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
        // 나무 밑동 타원
        ctx.beginPath();
        ctx.ellipse(pipe.x + pipeWidth / 2, canvas.height - 2, pipeWidth / 2.5, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#c68642';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.fillText(score, 20, 50);
}

function update() {
    if (gameOver) return;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Add pipes
    if (frame % 90 === 0) {
        let top = Math.random() * (canvas.height - pipeGap - 100) + 30;
        pipes.push({ x: canvas.width, top: top, passed: false });
    }
    // Move pipes
    pipes.forEach(pipe => pipe.x -= 2);
    // Remove off-screen pipes
    if (pipes.length && pipes[0].x + pipeWidth < 0) pipes.shift();

    // Collision detection
    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.w > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.h > pipe.top + pipeGap)
        ) {
            gameOver = true;
        }
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }
    });
    // Ground/ceiling collision
    if (bird.y + bird.h > canvas.height || bird.y < 0) {
        gameOver = true;
    }
    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawBird();
    drawScore();
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', 60, 300);
        ctx.font = '24px Arial';
        ctx.fillText('스페이스바로 재시작', 90, 350);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

resetGame();
gameLoop();
