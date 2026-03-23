import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialState,
  getNextFoodPosition,
  queueDirection,
  setRunning,
  tickGame,
} from './game.js';

test('snake moves one cell in current direction', () => {
  let state = createInitialState(8);
  state = setRunning(state, true);

  const next = tickGame(state, () => 0);

  assert.deepEqual(next.snake[0], { x: 5, y: 4 });
  assert.equal(next.snake.length, state.snake.length);
});

test('snake grows and increments score when eating food', () => {
  let state = createInitialState(8);
  state = {
    ...setRunning(state, true),
    food: { x: 5, y: 4 },
  };

  const next = tickGame(state, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, 4);
  assert.notDeepEqual(next.food, next.snake[0]);
});

test('reversing direction is ignored', () => {
  const state = createInitialState(8);
  const next = queueDirection(state, 'left');

  assert.equal(next.pendingDirection, 'right');
});

test('wall collisions end the game', () => {
  let state = createInitialState(4);
  state = {
    ...setRunning(state, true),
    snake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    direction: 'right',
    pendingDirection: 'right',
  };

  const next = tickGame(state, () => 0);

  assert.equal(next.isGameOver, true);
  assert.equal(next.isRunning, false);
});

test('food placement skips snake cells deterministically', () => {
  const food = getNextFoodPosition(
    3,
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
    ],
    () => 0,
  );

  assert.deepEqual(food, { x: 1, y: 1 });
});

test('self collisions end the game', () => {
  const state = {
    ...setRunning(createInitialState(6), true),
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
    ],
    direction: 'down',
    pendingDirection: 'down',
    food: { x: 5, y: 5 },
  };

  const next = tickGame(state, () => 0);

  assert.equal(next.isGameOver, true);
  assert.equal(next.isRunning, false);
});

