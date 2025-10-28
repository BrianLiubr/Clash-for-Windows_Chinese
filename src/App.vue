<template>
  <main class="app">
    <header class="app__header">
      <h1 class="app__title">Vue Gomoku</h1>
      <p class="app__subtitle">Challenge a friend to five-in-a-row, right in your browser.</p>
    </header>

    <Controls
      :status="statusMessage"
      :current-player="currentPlayer"
      :can-undo="canUndo"
      :winner="winner"
      :is-draw="isDraw"
      @undo="undo"
      @restart="restart"
    />

    <Board
      :board="board"
      :last-move="lastMove"
      :winning-line="winningLine"
      :locked="boardLocked"
      @place="handlePlace"
    />

    <footer class="app__footer">
      <span>Moves played: {{ movesPlayed }}</span>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Board from './components/Board.vue';
import Controls from './components/Controls.vue';
import type { Point } from './logic/types';
import { useGomokuGame } from './logic/game';

const {
  board,
  currentPlayer,
  winner,
  winningLine,
  isDraw,
  lastMove,
  canUndo,
  boardLocked,
  placeStone,
  undo,
  restart,
  statusMessage,
} = useGomokuGame();

const movesPlayed = computed(() =>
  board.value.reduce((total, row) => total + row.filter((cell) => cell !== 0).length, 0),
);

function handlePlace(point: Point) {
  placeStone(point.row, point.col);
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px 48px;
  gap: 24px;
}

.app__header {
  text-align: center;
  background: rgba(255, 255, 255, 0.68);
  padding: 20px 24px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
  max-width: 520px;
}

.app__title {
  margin: 0;
  font-size: clamp(1.8rem, 2.6vw, 2.6rem);
  color: #0f172a;
}

.app__subtitle {
  margin: 8px 0 0;
  color: #475569;
  font-size: 1rem;
}

.app__footer {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  color: #475569;
  font-weight: 500;
}

@media (max-width: 600px) {
  .app {
    padding: 24px 12px 40px;
  }

  .app__header {
    padding: 16px 18px;
  }
}
</style>
