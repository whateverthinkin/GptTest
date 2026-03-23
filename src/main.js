import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  setRunning,
  tickGame,
} from './game.js';

const TICK_MS = 140;
const board = document.querySelector('#game-board');
const scoreLabel = document.querySelector('#score');
const statusLabel = document.querySelector('#status');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');
const mobileButtons = document.querySelectorAll('[data-direction]');

let state = createInitialState(GRID_SIZE);
let intervalId = null;

function ensureLoop() {
  if (intervalId !== null) {
    return;
  }

  intervalId = window.setInterval(() => {
    const nextState = tickGame(state);
    if (nextState !== state) {
      state = nextState;
      render();
    }

    if (state.isGameOver || !state.isRunning) {
      stopLoop();
    }
  }, TICK_MS);
}

function stopLoop() {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
}

function startGame() {
  state = setRunning(state, true);
  render();
  ensureLoop();
}

function restartGame() {
  state = setRunning(createInitialState(GRID_SIZE), true);
  render();
  stopLoop();
  ensureLoop();
}

function togglePause() {
  if (state.isGameOver) {
    return;
  }

  state = setRunning(state, !state.isRunning);
  render();
  if (state.isRunning) {
    ensureLoop();
  } else {
    stopLoop();
  }
}

function updateDirection(nextDirection) {
  state = queueDirection(state, nextDirection);
  render();
}

function render() {
  scoreLabel.textContent = String(state.score);
  statusLabel.textContent = state.isGameOver
    ? 'Game over'
    : state.isRunning
      ? 'Running'
      : 'Paused';

  board.style.setProperty('--grid-size', String(state.gridSize));
  board.replaceChildren();

  for (let index = 0; index < state.snake.length; index += 1) {
    const segment = state.snake[index];
    const cell = document.createElement('div');
    cell.className = index === 0 ? 'cell snake snake-head' : 'cell snake';
    cell.style.gridColumnStart = String(segment.x + 1);
    cell.style.gridRowStart = String(segment.y + 1);
    board.appendChild(cell);
  }

  if (state.food) {
    const food = document.createElement('div');
    food.className = 'cell food';
    food.style.gridColumnStart = String(state.food.x + 1);
    food.style.gridRowStart = String(state.food.y + 1);
    board.appendChild(food);
  }
}

const KEY_TO_DIRECTION = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
};

window.addEventListener('keydown', (event) => {
  const direction = KEY_TO_DIRECTION[event.key];
  if (direction) {
    event.preventDefault();
    updateDirection(direction);
    if (!state.isGameOver && !state.isRunning) {
      startGame();
    }
    return;
  }

  if (event.code === 'Space') {
    event.preventDefault();
    togglePause();
  }

  if (event.key === 'Enter' && state.isGameOver) {
    restartGame();
  }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
mobileButtons.forEach((button) => {
  button.addEventListener('click', () => {
    updateDirection(button.dataset.direction);
    if (!state.isGameOver && !state.isRunning) {
      startGame();
    }
  });
});

render();
