// ======= SETUP =======
let canvas;
let ctx;
let objs = [];
let lastSpawnTime = 0;
const spawnInterval = 100;
const maxBounces = 10;

let mouse = { x: 0, y: 0 };

window.onload = init;

function init() {
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.requestAnimationFrame(gameLoop);
}

// ======= HELPER FUNCTIONS =======
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'pink'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function circle(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.vx = 0;
  this.vy = 2 + Math.random() * 3;
  this.radius = randomInteger(10, 30);
  this.mass = this.radius * 0.1;
  this.symbol = Math.random() < 0.5 ? '+' : '-';
  this.angle = 0;
  this.rotationSpeed = (Math.random() * 0.1) - 0.05;
  this.bounceCount = 0;
}

function createcircle() {
  const x = randomInteger(20, canvas.width - 20);
  const y = 0;
  const color = getRandomColor();
  objs.push(new circle(x, y, color));
}

// ======= COLLISION DETECTION =======
function resolveCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return;

  const nx = dx / distance;
  const ny = dy / distance;

  const p = 2 * (a.vx * nx + a.vy * ny - b.vx * nx - b.vy * ny) / (a.mass + b.mass);

  a.vx -= p * b.mass * nx;
  a.vy -= p * b.mass * ny;
  b.vx += p * a.mass * nx;
  b.vy += p * a.mass * ny;

  // Slightly separate overlapping circles
  const overlap = 0.5 * (a.radius + b.radius - distance + 1);
  a.x -= overlap * nx;
  a.y -= overlap * ny;
  b.x += overlap * nx;
  b.y += overlap * ny;

  // Change color on collision
  a.color = getRandomColor();
  b.color = getRandomColor();
}

// ======= GAME LOOP =======
function gameLoop(timestamp) {
  ctx.fillStyle = '#4FC3F7'; // blue water background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (timestamp - lastSpawnTime > spawnInterval) {
    createcircle();
    lastSpawnTime = timestamp;
  }

  const updatedObjs = [];

  for (let i = 0; i < objs.length; i++) {
    const c = objs[i];

    c.vy += 0.2;
    c.x += c.vx;
    c.y += c.vy;
    c.angle += c.rotationSpeed;

    if (c.y + c.radius >= canvas.height) {
      c.y = canvas.height - c.radius;
      c.vy = -c.vy * 0.7;
      c.bounceCount++;
    }

    if (c.x - c.radius <= 0 || c.x + c.radius >= canvas.width) {
      c.vx = -c.vx * 0.7;
    }

    c.vx *= 0.98;

    const dx = c.x - mouse.x;
    const dy = c.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < c.radius + 5) {
      const force = 5;
      const angle = Math.atan2(dy, dx);
      c.vx = Math.cos(angle) * force;
      c.vy = -Math.abs(Math.sin(angle) * force);
    }

    for (let j = i + 1; j < objs.length; j++) {
      const other = objs[j];
      const dx = other.x - c.x;
      const dy = other.y - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < c.radius + other.radius) {
        resolveCollision(c, other);
      }
    }

    if (c.bounceCount < maxBounces) {
      updatedObjs.push(c);
    }

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

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

  objs = updatedObjs;
  window.requestAnimationFrame(gameLoop);
}