/**** SETUP CODE ****/

window.onload = init;

let canvas, ctx;

function init() {
  canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  window.requestAnimationFrame(gameLoop);
}

/**** OBJECT CREATION FUNCTIONS ****/

function circle(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.vy = 2 + Math.random() * 3;
  this.radius = randomInteger(5, 20);
  this.symbol = Math.random() < 0.5 ? '+' : '-';
  this.angle = 0;
  this.rotationSpeed = (Math.random() * 0.1) - 0.05;
  this.bounceCount = 0;
}

const allowedColors = ['red', 'orange', 'yellow', 'green', 'blue', 'pink'];

function randomColor() {
  return allowedColors[Math.floor(Math.random() * allowedColors.length)];
}

let objs = [];
let currentcircle = 0;

function createcircle() {
  objs[currentcircle] = new circle(randomInteger(0, canvas.width), 0, randomColor());
  currentcircle++;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let lastSpawnTime = 0;
const spawnInterval = 100;
objs = objs.filter(c => c.y - c.radius < canvas.height);

/**** GAMELOOP ****/

function gameLoop(timestamp) {
  ctx.fillStyle = '#4FC3F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (timestamp - lastSpawnTime > spawnInterval) {
    createcircle();
    lastSpawnTime = timestamp;
  }

  // Build a new list of circles to keep
  const updatedObjs = [];

  for (let i = 0; i < objs.length; i++) {
    const c = objs[i];

    // Skip undefined objects just in case
    if (!c) continue;

    c.y += c.vy;
    c.angle += c.rotationSpeed;

    // Bounce logic
    if (c.y + c.radius >= canvas.height) {
      c.y = canvas.height - c.radius;
      c.vy = -c.vy * 0.7;
      c.bounceCount++;
    } else {
      c.vy += 0.2; // gravity
    }

    // Only keep circle if it's bounced fewer than 3 times
    if (c.bounceCount < 10) {
      updatedObjs.push(c);
    }

    // Draw circle
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw rotating symbol
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.fillStyle = 'black';
    ctx.font = `${c.radius}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.symbol, 0, 0);
    ctx.restore();
  }

  // Replace old array with updated one
  objs = updatedObjs;

  window.requestAnimationFrame(gameLoop);
}


// Optional: resize canvas when window is resized
window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
