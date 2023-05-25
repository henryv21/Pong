let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

let paddleWidth = 15;
let paddleHeight = 80;

let paddleA = {
  width: paddleWidth,
  height: paddleHeight,
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  dy: 5
};

let paddleB = {
  width: paddleWidth,
  height: paddleHeight,
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  dy: 5
};

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 2,
  dy: 2
};

let wPressed = false;
let sPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;
let gameOver = false;
let scoreA = 0;
let scoreB = 0;

document.addEventListener('keydown', function(event) {
  switch(event.key) {
    case 'w':
      wPressed = true;
      break;
    case 's':
      sPressed = true;
      break;
    case 'ArrowUp':
      upArrowPressed = true;
      break;
    case 'ArrowDown':
      downArrowPressed = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch(event.key) {
    case 'w':
      wPressed = false;
      break;
    case 's':
      sPressed = false;
      break;
    case 'ArrowUp':
      upArrowPressed = false;
      break;
    case 'ArrowDown':
      downArrowPressed = false;
      break;
  }
});

function drawNet() {
  context.fillStyle = '#FFF';
  context.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
  context.fillStyle = '#FFF';
  context.fill();
}

function drawPaddles() {
  context.fillStyle = '#FFF';
  context.fillRect(paddleA.x, paddleA.y, paddleA.width, paddleA.height);
  context.fillRect(paddleB.x, paddleB.y, paddleB.width, paddleB.height);
}

function movePaddleA() {
  if (wPressed && paddleA.y > 0) {
    paddleA.y -= paddleA.dy;
  } else if (sPressed && (paddleA.y < canvas.height - paddleA.height)) {
    paddleA.y += paddleA.dy;
  }
}

function movePaddleB() {
  if (upArrowPressed && paddleB.y > 0) {
    paddleB.y -= paddleB.dy;
  } else if (downArrowPressed && (paddleB.y < canvas.height - paddleB.height)) {
    paddleB.y += paddleB.dy;
  }
}

function ballMove() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1; 
  }

  if (ball.y + ball.radius > paddleA.y && ball.y - ball.radius < paddleA.y + paddleA.height && ball.dx < 0) {
    if (ball.x - ball.radius < paddleA.x + paddleA.width) {
      ball.dx *= -1;
      ball.dx *= 1.1;
      ball.dy *= 1.1;
    }
  }

  if (ball.y + ball.radius > paddleB.y && ball.y - ball.radius < paddleB.y + paddleB.height && ball.dx > 0) {
    if (ball.x + ball.radius > paddleB.x) {
      ball.dx *= -1;
      ball.dx *= 1.1;
      ball.dy *= 1.1;
    }
  }

  if (ball.x + ball.radius > canvas.width) {
    scoreA++;
    resetBall();
  }

  if (ball.x - ball.radius < 0) {
    scoreB++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 2;
  ball.dy = 2;
}

function animate() {
  if (!gameOver) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddles();
    drawNet();
    movePaddleA();
    movePaddleB();
    ballMove();

    context.fillStyle = '#FFF';
    context.font = '24px Arial';
    context.fillText(scoreA, canvas.width / 2 - 50, 50);
    context.fillText(scoreB, canvas.width / 2 + 50, 50);

    if (scoreA === 5) {
      gameOver = true;
      displayWinner('Player A');
    } else if (scoreB === 5) {
      gameOver = true;
      displayWinner('Player B');
    }
  }
  requestAnimationFrame(animate);
}

function getTouchPos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
    };
}

// Listen for touch events
canvas.addEventListener('touchmove', function(evt) {
    let touchPos = getTouchPos(canvas, evt);
    evt.preventDefault();

    // Player A controls
    if (touchPos.x < canvas.width / 2) {
        paddleA.y = touchPos.y - paddleA.height / 2;
        if (paddleA.y < 0) {
            paddleA.y = 0;
        } else if (paddleA.y > canvas.height - paddleA.height) {
            paddleA.y = canvas.height - paddleA.height;
        }
    }

    // Player B controls
    else {
        paddleB.y = touchPos.y - paddleB.height / 2;
        if (paddleB.y < 0) {
            paddleB.y = 0;
        } else if (paddleB.y > canvas.height - paddleB.height) {
            paddleB.y = canvas.height - paddleB.height;
        }
    }
}, false);

function displayWinner(winner) {
  context.fillStyle = '#FFF';
  context.font = '48px Arial';
  context.fillText(winner + ' Wins!', canvas.width / 2 - 100, canvas.height / 2);
  document.getElementById('restart-button').style.display = 'block';
}

document.getElementById('restart-button').addEventListener('click', function() {
  resetBall();
  paddleA.y = canvas.height / 2 - paddleHeight / 2;
  paddleB.y = canvas.height / 2 - paddleHeight / 2;
  scoreA = 0;
  scoreB = 0;
  gameOver = false;
  wPressed = false;
  sPressed = false;
  upArrowPressed = false;
  downArrowPressed = false;
  this.style.display = 'none';
});

animate();