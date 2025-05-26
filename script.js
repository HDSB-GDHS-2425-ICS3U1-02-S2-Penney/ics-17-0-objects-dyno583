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
  this.vy = 2 + Math.random() * 3; // Random fall speed
  this.radius = randomInteger(5, 20); // Limit size from 5px to 20px
}

const allowedColors = ['red', 'orange', 'yellow', 'green', 'blue', 'pink'];

function randomColor() {
  return allowedColors[Math.floor(Math.random() * allowedColors.length)];
}

const objs = [];
let currentcircle = 0;

function createcircle() {
  objs[currentcircle] = new circle(randomInteger(0, canvas.width), 0, randomColor());
  currentcircle++;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**** GAMELOOP ****/

function gameLoop(timestamp) {
  ctx.fillStyle = '#4FC3F7'; // A soft water blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < currentcircle; i++) {
    const c = objs[i];
    c.y += c.vy;

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  createcircle();

  window.requestAnimationFrame(gameLoop);
}

// Optional: resize canvas when window is resized
window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
