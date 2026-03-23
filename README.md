# GptTest

A minimal browser-based implementation of the classic Snake game.

## Run locally

1. Start the local dev server:
   ```bash
   npm start
   ```
2. Open `http://localhost:4173` in your browser.

## Available scripts

- `npm start` — serves the project with Python's built-in static file server.
- `npm test` — runs the built-in Node test suite for the Snake game logic.

## Manual verification checklist

- [ ] Movement works with arrow keys and WASD.
- [ ] The snake grows and the score increments after eating food.
- [ ] The game can be paused with Space and restarted with the Restart button.
- [ ] Hitting a wall or the snake body ends the game.
- [ ] On-screen controls move the snake on touch/mobile layouts.
