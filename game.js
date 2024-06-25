const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ambientSound = document.getElementById('ambientSound');
const failSound = document.getElementById('failSound');

let groundSprite = new Image();
groundSprite.src = './sprites/dirt_ground.png';  // Caminho para a imagem do chão
let groundWidth = 34; // largura do sprite do chão
let groundHeight = 34; // altura do sprite do chão

let greenMonsterSprite = new Image();
greenMonsterSprite.src = './sprites/bolsomonstro.gif' ;  // Caminho para o sprite do obstáculo

let purpleMonsterSprite = new Image();
purpleMonsterSprite.src = './sprites/bolsomonstro.gif' ;  // Caminho para o sprite do obstáculo

let adventure_Death = new Image();
adventure_Death.src = './sprites/dead.gif';

let gameState = 'playing';


// Variáveis do jogo
let adventure = {
    x: 50,
    y: 150,
    width: 70,
    height: 100,
    dy: 0,
    jumpStrength: 10,
    gravity: 0.5,
    grounded: false,
    sprite: new Image(),
    spriteWidth: 65, // Largura de um único sprite
    spriteHeight: 65, // Altura de um único sprite
    spriteIndex: 0, // Índice do sprite atual
    spriteCount: 6, // Número total de sprites na imagem
    spriteSpacing: 16
};


adventure.sprite.src = './sprites/Run-Sheet.png';


let obstacles = [];
let gameSpeed = 5;
let score = 0;
let animationSpeed = 10; // Menor valor = mais rápido
let frameCount = 0;

// Função para desenhar o adventuressauro
function drawadventure() {
    let spriteX;
    if (adventure.spriteIndex === 0 || adventure.spriteIndex === adventure.spriteCount - 1) {
        spriteX = adventure.spriteIndex * adventure.spriteWidth;
    } else {
        spriteX = adventure.spriteIndex * (adventure.spriteWidth + adventure.spriteSpacing);
    }
    ctx.drawImage(adventure.sprite, spriteX, 0, adventure.spriteWidth, adventure.spriteHeight, adventure.x, adventure.y - 20, adventure.width, adventure.height);
    // Ajuste em adventure.y - 20 para posicionar o adventuressauro um pouco acima do chão

    frameCount++;
    if (frameCount >= animationSpeed) {
        adventure.spriteIndex = (adventure.spriteIndex + 1) % adventure.spriteCount;
        frameCount = 0;
    }
}

// Função para desenhar o chão
function drawGround() {
    for (let x = 0; x < canvas.width; x += groundWidth) {
        ctx.drawImage(groundSprite, x, canvas.height - groundHeight, groundWidth, groundHeight);
    }
}

// Função para desenhar obstáculos como sprites
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.sprite, obstacle.x, obstacle.y - 20, obstacle.width, obstacle.height);
        // Ajuste em obstacle.y - 20 para posicionar os obstáculos um pouco acima do chão
    });
}

// Função para atualizar obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 500) {
        let obstacle = {
            x: canvas.width,
            y: 160,
            width: 30, // Largura do obstáculo
            height: 30, // Altura do obstáculo
            sprite: Math.random() < 0.5 ? greenMonsterSprite : purpleMonsterSprite // Escolha aleatória entre os sprites
        };
        obstacles.push(obstacle);
    }

    if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        score++;
    }
}

// Função para detectar colisão
function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            adventure.x-20 < obstacle.x + obstacle.width &&
            adventure.x-20 + adventure.width > obstacle.x &&
            adventure.y-20 < obstacle.y + obstacle.height &&
            adventure.y-20 + adventure.height > obstacle.y
        ) {
            // Colisão detectada
            ambientSound.pause();
            failSound.play();
            stopGame();
            gameOver(); // Mostra a tela de game over
        }
    });
}

function stopGame() {
    gameState = 'gameOver';  // Altera o estado do jogo para 'gameOver'
    cancelAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(adventure_Death, 0, 0, 100, 100, adventure.x, adventure.y, adventure.width, adventure.height);
}


// Função para reiniciar o jogo
function resetGame() {
    score = 0;
    obstacles = [];
    adventure.y = 150;
    adventure.dy = 0;
    adventure.grounded = false;
    adventure.spriteIndex = 0; // Reseta o índice do sprite do adventuressauro
    gameState = 'playing'; // Altera o estado do jogo para 'playing' para reiniciar o loop do jogo
    ambientSound.currentTime = 0;
    ambientSound.play();
    gameLoop(); // Reinicia o loop do jogo
}

// Função para atualizar o adventuressauro
function updateadventure() {
    if (adventure.grounded && adventure.dy === 0 && isJumping) {
        adventure.dy = -adventure.jumpStrength;
        adventure.grounded = false;
    }

    adventure.dy += adventure.gravity;
    adventure.y += adventure.dy;

    if (adventure.y + adventure.height > canvas.height - 10) {
        adventure.y = canvas.height - 10 - adventure.height;
        adventure.dy = 0;
        adventure.grounded = true;
    }
}

// Variável para detectar se o jogador está tentando pular
let isJumping = false;
let isKeyDown = false;  // Adiciona um verificador para garantir que a tecla foi pressionada apenas uma vez

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !isKeyDown) {
        isJumping = true;
        isKeyDown = true;  // Marca que a tecla foi pressionada
        adventure.sprite.src = './sprites/Jump-All-Sheet.png';
        adventure.spriteCount = 10;
        adventure.spriteSpacing = 0;
        setTimeout(trocaSprite, 800);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isKeyDown = false;  // Reseta o verificador quando a tecla é liberada
        isJumping = false;  // Opcional: Se quiser resetar o estado de pular quando a tecla é liberada
    }
});

function trocaSprite(){
    adventure.sprite.src = './sprites/Run-Sheet.png';
    adventure.spriteCount = 6;
    adventure.spriteSpacing = 16;
}
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = false;
    }
});

// Função para desenhar o score
function drawScore() {
    ctx.font = '24px MyCustomFont'; // Defina o tamanho e o nome da fonte personalizada
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Função para desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawadventure();
    drawObstacles();
    drawScore();
}

// Função para atualizar o jogo
function update() {
    updateadventure();
    updateObstacles();
    detectCollision();
}

function gameOver() {
    // Mostra a tela de game over
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawScore();
    //drawObstacles();
    //desenha o persanagem morto
    ctx.drawImage(adventure_Death, 0, 0, 5000, 5000, adventure.x, 145, 200, 200);

    ctx.font = '30px MyCustomFont';
    ctx.fillStyle = 'black';
    ctx.fillText('O bonoro te pegou', canvas.width / 2 - 70, canvas.height / 2 - 15);

    // Adiciona um EventListener para reiniciar o jogo ao pressionar o pulo
    document.addEventListener('keydown', restartGame);
}

function restartGame(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        document.removeEventListener('keydown', restartGame); // Remove o EventListener para evitar múltiplas reinicializações
        resetGame(); // Reinicia o jogo
    }
}


function gameLoop() {
    if (gameState === 'playing') {
        draw();
        update();
        requestAnimationFrame(gameLoop);
    } else if (gameState === 'gameOver') {
        draw();
        gameOver();
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                gameState = 'playing';
            }
        });
    }
}


// Iniciar o loop do jogo
gameLoop();
