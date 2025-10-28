<template>
  <div class="board" :style="{ gridTemplateColumns: `repeat(${size}, 1fr)` }">
    <button
      v-for="cell in cells"
      :key="`${cell.row}-${cell.col}`"
      class="board__cell"
      :class="{
        'board__cell--black': cell.value === 1,
        'board__cell--white': cell.value === 2,
        'board__cell--last': isLastCell(cell.row, cell.col),
        'board__cell--winning': winningSet.has(`${cell.row}:${cell.col}`),
      }"
      :disabled="props.locked || cell.value !== 0"
      @click="handleClick({ row: cell.row, col: cell.col })"
    >
      <span
        v-if="cell.value !== 0"
        class="board__stone"
        :class="{ 'board__stone--white': cell.value === 2 }"
      ></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Board, CellState, Move, Point } from '../logic/types';

type CellDescriptor = {
  value: CellState;
  row: number;
  col: number;
};

const props = defineProps<{
  board: Board;
  lastMove: Move | null;
  winningLine: Point[];
  locked: boolean;
}>();

const emit = defineEmits<{
  (event: 'place', payload: Point): void;
}>();

const size = computed(() => props.board.length);

const cells = computed<CellDescriptor[]>(() =>
  props.board.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => ({ value, row: rowIndex, col: colIndex })),
  ),
);

const winningSet = computed(() => {
  const set = new Set<string>();
  props.winningLine.forEach((point) => {
    set.add(`${point.row}:${point.col}`);
  });
  return set;
});

function handleClick(point: Point) {
  if (props.locked) {
    return;
  }

  if (props.board[point.row][point.col] !== 0) {
    return;
  }

  emit('place', point);
}

function isLastCell(row: number, col: number) {
  return props.lastMove?.row === row && props.lastMove?.col === col;
}
</script>

<style scoped>
.board {
  position: relative;
  margin: 0 auto;
  width: min(92vw, 540px);
  aspect-ratio: 1;
  display: grid;
  gap: 0;
  padding: 12px;
  background: #f4d27f;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
}


.board__cell {
  position: relative;
  border: 1px solid rgba(148, 111, 65, 0.45);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.board__cell:focus-visible {
  outline: 3px solid rgba(14, 165, 233, 0.8);
  outline-offset: -3px;
}

.board__cell:not(:disabled):hover {
  background-color: rgba(14, 165, 233, 0.15);
}

.board__cell:disabled {
  cursor: not-allowed;
}

.board__stone {
  width: 68%;
  height: 68%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ededed, #111827);
  box-shadow: inset 2px 2px 6px rgba(255, 255, 255, 0.35),
    inset -4px -4px 12px rgba(17, 24, 39, 0.75);
  pointer-events: none;
}

.board__stone--white {
  background: radial-gradient(circle at 30% 30%, #ffffff, #cbd5f5);
  box-shadow: inset 2px 2px 6px rgba(255, 255, 255, 0.75),
    inset -4px -4px 12px rgba(148, 163, 184, 0.8);
}

.board__cell--last {
  box-shadow: inset 0 0 0 4px rgba(14, 165, 233, 0.6);
}

.board__cell--winning {
  background-color: rgba(34, 197, 94, 0.28);
  box-shadow: inset 0 0 0 3px rgba(16, 185, 129, 0.8);
}

@media (max-width: 480px) {
  .board {
    width: 94vw;
    padding: 8px;
    border-radius: 14px;
  }
}
</style>
