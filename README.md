# Vue 3 Gomoku

A responsive Gomoku (Five-in-a-Row) board game built with Vue 3, Vite, and TypeScript. Play locally with a friend, undo moves, highlight the latest stone, and celebrate the winning chain – all in the browser.


## Features

- 🎮 **Local two-player experience** – players alternate between black and white stones on a 15×15 board.
- ✨ **Rich interactions** – highlights the latest move and the complete winning line, with automatic prevention of invalid moves.
- ♻️ **Undo & restart** – roll back as many moves as needed or reset the entire match in a single click.
- 📱 **Responsive layout** – playable on desktop and mobile browsers thanks to a CSS Grid based board.
- 🧠 **AI ready** – an `src/ai/agent.ts` stub is included so you can plug in your own opponent in the future.
- ✅ **Quality tooling** – TypeScript, ESLint, Prettier, and Vitest keep the codebase reliable and consistent.
- 🚀 **Deployable** – GitHub Actions workflow prepares the project for GitHub Pages hosting.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

```bash
npm install
```

### Development

Run the dev server and open the suggested URL in your browser:

```bash
npm run dev
```

### Build & preview

Create an optimized production bundle:

```bash
npm run build
```

Preview the built bundle locally:

```bash
npm run preview
```

### Linting & formatting

```bash
npm run lint
npm run format
```

### Tests

Unit tests cover the game logic (win detection, undo, and board locking):

```bash
npm test
```

## Project structure

```
.
├── public/               # Static assets served as-is
├── src/
│   ├── ai/               # AI stub (future expansion)
│   ├── components/       # UI components (Board, Controls)
│   ├── logic/            # Game state, rules, and shared types
│   ├── styles/           # Global styles
│   ├── App.vue           # Root component
│   └── main.ts           # App bootstrap
├── tests/                # Vitest unit tests
├── .github/workflows/    # GitHub Pages deployment workflow
└── ...
```

## Gameplay basics

1. The board starts empty and black plays first.
2. Click a cell to place the current player's stone.
3. Players alternate automatically after each valid move.
4. The most recent move receives a glowing outline; when five stones align horizontally, vertically, or diagonally the matching cells are highlighted.
5. Use **Undo** to step back through the history or **Restart** to reset the game.
6. Once a winner is declared (or the board is full) no further moves are accepted until you undo or restart.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the project and publishes it to GitHub Pages whenever you push to the `main` branch.

To ship it:

1. Enable GitHub Pages in your repository settings (Pages → Build and deployment → Source: **GitHub Actions**).
2. Merge your changes into `main` and push.
3. The workflow will compile the project and publish the static site to the `gh-pages` branch.

## License

This project is released under the [MIT License](LICENSE) – feel free to fork it and build your own enhancements!
