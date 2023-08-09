// DOM elements
let startWindow, gameWindow, usernameInput, usernameDisplay, hitInfo, gameOverWindow, resetButton;

// Constants for bee types
const QUEEN = 'queen';
const WORKER = 'worker';
const DRONE = 'drone';

// Bee objects
const bees = [
  { type: QUEEN, points: 100, image: '../images/queen1.png', x: 450, y: 50, width: 100, height: 100 },
  { type: WORKER, points: 75, image: '../images/worker.png', x: 150, y: 200, width: 80, height: 80 },
  { type: WORKER, points: 75, image: '../images/worker.png', x: 350, y: 200, width: 80, height: 80 },
  { type: WORKER, points: 75, image: '../images/worker.png', x: 550, y: 200, width: 80, height: 80 },
  { type: WORKER, points: 75, image: '../images/worker.png', x: 150, y: 100, width: 80, height: 80 },
  { type: WORKER, points: 75, image: '../images/worker.png', x: 350, y: 100, width: 80, height: 80 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 550, y: 100, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 750, y: 100, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 750, y: 200, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 150, y: 300, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 350, y: 300, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 550, y: 300, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 750, y: 300, width: 50, height: 50 },
  { type: DRONE, points: 50, image: '../images/drone.png', x: 450, y: 150, width: 50, height: 50 }
];

let canvas, ctx, hitButton;
let gameOver = false;
let hitMarker = null;

function preloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageUrl;
  });
}

async function loadImages() {
  for (const bee of bees) {
    bee.image = await preloadImage(bee.image);
  }
}

function getRandomBee() {
  return bees[Math.floor(Math.random() * bees.length)];
}

function drawBee(bee) {
  ctx.drawImage(bee.image, bee.x, bee.y, bee.width, bee.height);
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(bee.type + '-' + bee.points + "HP", bee.x + 5, bee.y + 20);
}

function drawBees() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bees.forEach(bee => {
    drawBee(bee);
  });
  if (hitMarker) {
    ctx.beginPath();
    ctx.arc(hitMarker.x, hitMarker.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }
}

function moveBees() {
  bees.forEach(bee => {
    if (!gameOver) {
      bee.x += Math.random() * 6 - 3;
      bee.y += Math.random() * 2 - 1;
      bee.x = Math.max(0, Math.min(bee.x, canvas.width - bee.width));
      bee.y = Math.max(0, Math.min(bee.y, canvas.height - bee.height));
    }
  });
}

function countBeesByType() {
  const beeCountByType = {};
  for (const bee of bees) {
    beeCountByType[bee.type] = (beeCountByType[bee.type] || 0) + 1;
  }
  return beeCountByType;
}

function updateBeeCounts() {
  const beeCountByType = countBeesByType();
  let beeCountText = 'Bees Alive:';
  for (const type in beeCountByType) {
    beeCountText += ` ${type}: ${beeCountByType[type]},`;
  }
  beeCountText = beeCountText.slice(0, -1);
  document.getElementById('beeCounts').textContent = beeCountText;
}

function displayHitInfo(beeType, damage) {
  const hitInfo = document.getElementById('hitInfo');
  hitInfo.textContent = `Hit: ${beeType} (Damage: ${damage}HP)`;
}

function hitBee() {
  if (!gameOver) {
    const bee = getRandomBee();
    hitMarker = { x: bee.x + bee.width / 2, y: bee.y + bee.height / 2 };
    let damage = 0;

    switch (bee.type) {
      case QUEEN:
        bee.points -= 8;
        damage = 8;
        break;
      case WORKER:
        bee.points -= 10;
        damage = 10;
        break;
      case DRONE:
        bee.points -= 12;
        damage = 12;
        break;
    }

    if (bee.points <= 0 && bee.type === QUEEN) {
      bees.splice(bees.indexOf(bee), 1);
      gameOver = true;
      if (gameOver) {
        showGameOverScreen(); 
      }
    }

    if (bee.points <= 0 && bee.type !== QUEEN) {
      bees.splice(bees.indexOf(bee), 1);
    }

    drawBees();

    displayHitInfo(bee.type, damage); 

    setTimeout(() => {
      hitMarker = null;
      drawBees();
      const hitDiv = document.getElementById('hitInfo');
      hitDiv.textContent = ''; 
    }, 800);
  }
}

function gameLoop() {
  moveBees();
  drawBees();
  updateBeeCounts();
  requestAnimationFrame(gameLoop);
}

function showGameOverScreen() {
  gameWindow.style.display = "none";
  gameOverWindow.style.display = "block";
}

async function init() {
  startWindow = document.getElementById("startWindow");
  gameWindow = document.getElementById("gameWindow");
  usernameInput = document.getElementById("username");
  usernameDisplay = document.getElementById("usernameDisplay");
  hitInfo = document.getElementById("hitInfo");
  gameOverWindow = document.getElementById("gameOverWindow");

  const username = usernameInput.value.trim();

  if (username === "") {
    alert("Please enter a valid username.");
    return;
  }

  startWindow.style.display = "none";
  gameWindow.style.display = "block";
  usernameDisplay.textContent = `Username: ${username}`;

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  hitButton = document.getElementById('hitButton');

  await loadImages();

  hitButton.addEventListener('click', hitBee);

  gameLoop();
}

document.getElementById("startButton").addEventListener("click", init);

init();
