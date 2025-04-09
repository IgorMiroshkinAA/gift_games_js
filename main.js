const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const menu = document.getElementById('menu');
const newGameButton = document.getElementById('newGameButton');
const highScoreButton = document.getElementById('highScoreButton');
const difficultyButtons = document.querySelectorAll('.difficultyButton');

let highScore = 0;
let difficulty = 'normal';

highScoreButton.addEventListener('click', () => {
    alert(`Лучший резуьтат: ${highScore} очков`);
});

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficulty = button.getAttribute('data-difficulty');
        alert(`Ложность установлена: ${difficulty}`)
    })
})

newGameButton.addEventListener('click', () => {
    menu.style.display = 'none';
    restartGame();
})

let isGamedPaused = false;

function showModal(message) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    modal.style.textAlign = 'center';
    modal.style.zIndex = '1000';

    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    const button = document.createElement('button');
    button.textContent = 'Перезапустить игру';
    button.onclick = () => {
        document.body.removeChild(modal);
        isGamedPaused = false;
        update();
    }

    modal.appendChild(messageElement);
    modal.appendChild(button);
    document.body.appendChild(modal);
}

function showDefeatModal(message) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    modal.style.textAlign = 'center';
    modal.style.zIndex = '1000';

    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    const button = document.createElement('button');
    button.textContent = 'Перезапустить игру';
    button.onclick = () => {
        document.body.removeChild(modal);
        restartGame();
    }

    modal.appendChild(messageElement);
    modal.appendChild(button);
    document.body.appendChild(modal);
}

const player = {
    width: 50,
    height: 50,
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    speed: 5,
    dx: 0
};

const gifts = [];
const specialBlackBlocks = [];
const specialYellowBlocks = [];
const giftCount = 10;
let score = 0;
let level = 1;
let giftTypes = ['red', 'blue', 'green'];

function restartGame() {
    score = 0;
    level = 1;
    player.width = 50;

    switch(difficulty) {
        case 'easy': 
            player.speed = 3;
            player.width = 100;
            gifts.forEach(gift => gift.speed = 3)
            break;
        case 'normal':
            player.speed = 5;
            player.width = 50;
            gifts.forEach(gift => gift.speed = 5)
            break;
        case 'hard':
            player.speed = 7;
            player.width = 40;
            gifts.forEach(gift => gift.speed = 7)
            break;
    }

    gifts.length = 0;
    specialBlackBlocks.length = 0;
    specialYellowBlocks.length = 0;

    createGifts();
    createSpecialBlackBlock();
    createSpecialYelloBlock();

    update();
}

function createGifts() {
    for (let i = 0; i < giftCount; i++) {
        gifts.push({
            width: 30,
            height: 30,
            x: Math.random() * (canvas.width - 30),
            y: Math.random() * -canvas.height,
            speed: 3 + level,
            type: giftTypes[Math.floor(Math.random() * giftTypes.length)]
        });
    }
}

function createSpecialBlackBlock() {
    specialBlackBlocks.push({
        width: 30,
        height: 30,
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * -canvas.height,
        speed: 10,
        color: 'black'
    });
}

function createSpecialYelloBlock() {
    specialYellowBlocks.push({
        width: 30,
        height: 30,
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * -canvas.height,
        speed: 10,
        color: 'yellow'
    });
}

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGifts() {
    gifts.forEach(gift => {
        ctx.fillStyle = gift.type;
        ctx.fillRect(gift.x, gift.y, gift.width, gift.height);
    });
}

function drawSpecialBlackBlocks() {
    specialBlackBlocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

function drawSpecialYelloBlock() {
    specialYellowBlocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveGifts() {
    gifts.forEach(gift => {
        gift.y += gift.speed;

        if (gift.y > canvas.height) {
            gift.y = Math.random() * -canvas.height;
            gift.x = Math.random() * (canvas.width - gift.width);
        }
    });
}

function moveSpecialBlackBlocks() {
    specialBlackBlocks.forEach(block => {
        block.y += block.speed;

        if (block.y > canvas.height) {
            block.y = Math.random() * -canvas.height;
            block.x = Math.random() * (canvas.width - block.width);
        }
    });
}

function moveSpecialYellowBlocks() {
    specialYellowBlocks.forEach(block => {
        block.y += block.speed;

        if (block.y > canvas.height) {
            block.y = Math.random() * -canvas.height;
            block.x = Math.random() * (canvas.width - block.width);
        }
    });
}

function detectCollisions() {
    gifts.forEach((gift, index) => {
        if (
            player.x < gift.x + gift.width &&
            player.x + player.width > gift.x &&
            player.y < gift.y + gift.height &&
            player.y + player.height > gift.y
        ) {
            gifts.splice(index, 1);
            score += 10;
            console.log('Подарок собран!');
        }
    });

    specialBlackBlocks.forEach((block, index) => {
        if (
            player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y
        ) {
            specialBlackBlocks.splice(index, 1);
            player.width += 20;
            console.log('Специальный блок пойман!');
        }
    });

    specialYellowBlocks.forEach((block, index) => {
        if (
            player.x < block.x + block.width &&
            player.x + player.width > block.x &&
            player.y < block.y + block.height &&
            player.y + player.height > block.y
        ) {
            specialYellowBlocks.splice(index, 1);
            player.width -= 20;
            console.log('Специальный блок пойман!');
        }
    });


}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Level: ${level}`, 10, 50);
}

function update() {
    if (isGamedPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawGifts();
    drawSpecialBlackBlocks();
    drawSpecialYelloBlock();
    drawScore();

    movePlayer();
    moveGifts();
    moveSpecialBlackBlocks();
    moveSpecialYellowBlocks();
    detectCollisions();

    if (player.width <= 0) {
        showDefeatModal(`Вы проиграли! Ваш счет: ${score}. Уровень: ${level}`);
        return;
    }

    if (score >= level * 100) {
        level++;

        isGamedPaused = true;
        showModal(`Поздравляем! Вы достигли уровня ${level - 1} с ${score} очками!`)

        gifts.length = 0;
        specialBlackBlocks.length = 0;
        specialYellowBlocks.length = 0;

        createGifts();
        createSpecialBlackBlock();
        createSpecialYelloBlock();
    }

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        player.dx = 0;
    }
}

createGifts();
createSpecialBlackBlock();
createSpecialYelloBlock();
update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);