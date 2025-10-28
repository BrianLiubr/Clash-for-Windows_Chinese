<template>
  <section class="controls">
    <div class="controls__info">
      <p class="controls__status">{{ status }}</p>
      <div class="controls__indicator" v-if="indicatorPlayer !== null">
        <span class="controls__label">{{ indicatorLabel }}</span>
        <span class="controls__stone" :class="stoneClass(indicatorPlayer)" aria-hidden="true"></span>
        <span class="controls__name">{{ playerNames[indicatorPlayer] }}</span>
      </div>
      <div v-else class="controls__indicator">
        <span class="controls__label">Result</span>
        <span class="controls__name">Draw</span>
      </div>
    </div>
    <div class="controls__actions">
      <button type="button" class="controls__button" :disabled="!canUndo" @click="emit('undo')">
        Undo
      </button>
      <button type="button" class="controls__button controls__button--restart" @click="emit('restart')">
        Restart
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Player } from '../logic/types';
import { PLAYER_NAMES } from '../logic/types';

type IndicatorPlayer = Player | null;

const props = defineProps<{
  status: string;
  currentPlayer: Player;
  canUndo: boolean;
  winner: Player | null;
  isDraw: boolean;
}>();

const emit = defineEmits<{
  (event: 'undo'): void;
  (event: 'restart'): void;
}>();

const playerNames = PLAYER_NAMES;

const indicatorPlayer = computed<IndicatorPlayer>(() => {
  if (props.isDraw) {
    return null;
  }

  return props.winner ?? props.currentPlayer;
});

const indicatorLabel = computed(() => {
  if (props.winner) {
    return 'Winner';
  }

  if (props.isDraw) {
    return 'Result';
  }

  return 'Next';
});

function stoneClass(player: Player) {
  return player === 1 ? 'controls__stone--black' : 'controls__stone--white';
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  margin: 0 auto 24px;
  width: min(92vw, 540px);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(148, 163, 184, 0.35);
  backdrop-filter: blur(6px);
}

.controls__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.controls__status {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}

.controls__indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
}

.controls__label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 600;
  color: #2563eb;
}

.controls__stone {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  box-shadow: inset 1px 1px 4px rgba(255, 255, 255, 0.4), inset -4px -4px 10px rgba(15, 23, 42, 0.55);
}

.controls__stone--white {
  background: radial-gradient(circle at 30% 30%, #ffffff, #dce4ff);
  box-shadow: inset 2px 2px 6px rgba(255, 255, 255, 0.85), inset -5px -5px 12px rgba(148, 163, 184, 0.7);
}

.controls__stone--black {
  background: radial-gradient(circle at 30% 30%, #f8fafc, #111827);
}

.controls__name {
  font-weight: 600;
  color: #1f2937;
}

.controls__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.controls__button {
  flex: 1;
  min-width: 140px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: white;
  background: linear-gradient(135deg, #2563eb, #4338ca);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.controls__button:disabled {
  opacity: 0.55;
  box-shadow: none;
}

.controls__button:not(:disabled):active {
  transform: translateY(1px);
}

.controls__button--restart {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
}

@media (max-width: 480px) {
  .controls {
    padding: 14px;
    border-radius: 16px;
  }

  .controls__button {
    min-width: unset;
    width: 100%;
  }
}
</style>
