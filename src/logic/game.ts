import { computed, ref } from 'vue';
import type { Board, CellState, Move, Player, Point, WinningInfo } from './types';
import { BOARD_SIZE, PLAYER_NAMES } from './types';

const DIRECTIONS: Array<[number, number]> = [
  [0, 1], // horizontal
  [1, 0], // vertical
  [1, 1], // main diagonal
  [1, -1], // anti diagonal
];

export function createEmptyBoard(size: number = BOARD_SIZE): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as CellState),
  );
}

function inBounds(row: number, col: number, size: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function nextPlayer(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function findWinningLine(board: Board, move: Move): Point[] | null {
  for (const [dr, dc] of DIRECTIONS) {
    const line: Point[] = [{ row: move.row, col: move.col }];

    // forward direction
    let r = move.row + dr;
    let c = move.col + dc;
    while (inBounds(r, c, board.length) && board[r][c] === move.player) {
      line.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    // backward direction
    r = move.row - dr;
    c = move.col - dc;
    while (inBounds(r, c, board.length) && board[r][c] === move.player) {
      line.unshift({ row: r, col: c });
      r -= dr;
      c -= dc;
    }

    if (line.length >= 5) {
      return line;
    }
  }

  return null;
}

export function checkWin(board: Board, move: Move): WinningInfo | null {
  const line = findWinningLine(board, move);
  if (!line) {
    return null;
  }

  return {
    winner: move.player,
    line,
  };
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== 0));
}

export function useGomokuGame(size: number = BOARD_SIZE) {
  const board = ref<Board>(createEmptyBoard(size));
  const currentPlayer = ref<Player>(1);
  const moves = ref<Move[]>([]);
  const winner = ref<Player | null>(null);
  const winningLine = ref<Point[]>([]);
  const isDraw = ref(false);

  const lastMove = computed(() =>
    moves.value.length > 0 ? moves.value[moves.value.length - 1] : null,
  );
  const canUndo = computed(() => moves.value.length > 0);
  const boardLocked = computed(() => winner.value !== null || isDraw.value);

  function placeStone(row: number, col: number) {
    if (boardLocked.value) {
      return;
    }

    if (!inBounds(row, col, size)) {
      return;
    }

    if (board.value[row][col] !== 0) {
      return;
    }

    const move: Move = { row, col, player: currentPlayer.value };
    board.value[row][col] = move.player;
    moves.value.push(move);

    const result = checkWin(board.value, move);
    if (result) {
      winner.value = result.winner;
      winningLine.value = result.line;
      return;
    }

    if (isBoardFull(board.value)) {
      isDraw.value = true;
      return;
    }

    currentPlayer.value = nextPlayer(currentPlayer.value);
  }

  function undo() {
    if (!moves.value.length) {
      return;
    }

    const last = moves.value.pop()!;
    board.value[last.row][last.col] = 0;
    winner.value = null;
    winningLine.value = [];
    isDraw.value = false;
    currentPlayer.value = last.player;
  }

  function restart() {
    board.value = createEmptyBoard(size);
    moves.value = [];
    currentPlayer.value = 1;
    winner.value = null;
    winningLine.value = [];
    isDraw.value = false;
  }

  const statusMessage = computed(() => {
    if (winner.value) {
      return `${PLAYER_NAMES[winner.value]} wins!`;
    }

    if (isDraw.value) {
      return 'Draw game';
    }

    return `Current player: ${PLAYER_NAMES[currentPlayer.value]}`;
  });

  return {
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
  };
}
