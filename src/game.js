export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = 'right';

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(gridSize = GRID_SIZE) {
  const center = Math.floor(gridSize / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    gridSize,
    snake,
    direction: INITIAL_DIRECTION,
    pendingDirection: INITIAL_DIRECTION,
    food: getNextFoodPosition(gridSize, snake),
    score: 0,
    isGameOver: false,
    isRunning: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return state;
  }

  const blockedDirection = OPPOSITE_DIRECTIONS[state.direction];
  if (nextDirection === blockedDirection && state.snake.length > 1) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
  };
}

export function tickGame(state, random = Math.random) {
  if (state.isGameOver || !state.isRunning) {
    return state;
  }

  const direction = state.pendingDirection;
  const vector = DIRECTION_VECTORS[direction];
  const currentHead = state.snake[0];
  const nextHead = {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };

  const willEat = positionsEqual(nextHead, state.food);
  const snakeToCheck = willEat ? state.snake : state.snake.slice(0, -1);

  if (isOutOfBounds(nextHead, state.gridSize) || hasCollision(nextHead, snakeToCheck)) {
    return {
      ...state,
      direction,
      isRunning: false,
      isGameOver: true,
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction,
    food: willEat ? getNextFoodPosition(state.gridSize, nextSnake, random) : state.food,
    score: willEat ? state.score + 1 : state.score,
  };
}

export function setRunning(state, isRunning) {
  if (state.isGameOver && isRunning) {
    return state;
  }

  return {
    ...state,
    isRunning,
  };
}

export function getNextFoodPosition(gridSize, snake, random = Math.random) {
  const openCells = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (!snake.some((segment) => segment.x === x && segment.y === y)) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.min(openCells.length - 1, Math.floor(random() * openCells.length));
  return openCells[index];
}

export function positionsEqual(a, b) {
  return Boolean(a && b) && a.x === b.x && a.y === b.y;
}

function isOutOfBounds(position, gridSize) {
  return position.x < 0 || position.y < 0 || position.x >= gridSize || position.y >= gridSize;
}

function hasCollision(head, snake) {
  return snake.some((segment) => positionsEqual(segment, head));
}
