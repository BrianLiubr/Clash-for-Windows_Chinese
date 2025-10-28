import { describe, expect, it } from 'vitest';
import { checkWin, createEmptyBoard, findWinningLine, isBoardFull, useGomokuGame } from '../src/logic/game';
import type { Board, Move } from '../src/logic/types';

function applyMove(board: Board, move: Move) {
  board[move.row][move.col] = move.player;
}

describe('gomoku core logic', () => {
  it('creates an empty 15x15 board', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(15);
    expect(board.every((row) => row.length === 15)).toBe(true);
    expect(board.flat().every((cell) => cell === 0)).toBe(true);
  });

  it('detects a horizontal victory', () => {
    const board = createEmptyBoard(15);
    const moves: Move[] = [
      { row: 7, col: 0, player: 1 },
      { row: 7, col: 1, player: 1 },
      { row: 7, col: 2, player: 1 },
      { row: 7, col: 3, player: 1 },
      { row: 7, col: 4, player: 1 },
    ];

    moves.forEach((move) => applyMove(board, move));
    const result = checkWin(board, moves[moves.length - 1]);

    expect(result).not.toBeNull();
    expect(result?.winner).toBe(1);
    expect(result?.line).toHaveLength(5);
  });

  it('detects a diagonal victory', () => {
    const board = createEmptyBoard(15);
    const moves: Move[] = [
      { row: 2, col: 2, player: 2 },
      { row: 3, col: 3, player: 2 },
      { row: 4, col: 4, player: 2 },
      { row: 5, col: 5, player: 2 },
      { row: 6, col: 6, player: 2 },
    ];

    moves.forEach((move) => applyMove(board, move));
    const result = checkWin(board, moves[moves.length - 1]);

    expect(result).not.toBeNull();
    expect(result?.line?.map(({ row, col }) => [row, col])).toContainEqual([2, 2]);
    expect(result?.line).toHaveLength(5);
  });

  it('does not declare a win when fewer than five stones align', () => {
    const board = createEmptyBoard(10);
    const moves: Move[] = [
      { row: 5, col: 5, player: 1 },
      { row: 5, col: 6, player: 1 },
      { row: 5, col: 7, player: 1 },
      { row: 5, col: 8, player: 1 },
    ];

    moves.forEach((move) => applyMove(board, move));
    const line = findWinningLine(board, moves[moves.length - 1]);
    expect(line).toBeNull();
  });

  it('identifies a full board', () => {
    const board = createEmptyBoard(3);
    board.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        board[rowIndex][colIndex] = (rowIndex + colIndex) % 2 ? 1 : 2;
      });
    });

    expect(isBoardFull(board)).toBe(true);
  });
});

describe('useGomokuGame composable', () => {
  it('alternates turns and prevents overwriting moves', () => {
    const game = useGomokuGame(5);

    game.placeStone(0, 0);
    expect(game.board.value[0][0]).toBe(1);
    expect(game.currentPlayer.value).toBe(2);

    // attempt to place on the same cell should be ignored
    game.placeStone(0, 0);
    expect(game.currentPlayer.value).toBe(2);
    expect(game.board.value[0][0]).toBe(1);
  });

  it('supports undo operations and resets winner state', () => {
    const game = useGomokuGame(5);

    game.placeStone(0, 0); // player 1
    game.placeStone(1, 0); // player 2
    game.placeStone(0, 1); // player 1
    game.placeStone(1, 1); // player 2
    game.placeStone(0, 2); // player 1
    game.placeStone(1, 2); // player 2
    game.placeStone(0, 3); // player 1
    game.placeStone(1, 3); // player 2
    game.placeStone(0, 4); // player 1 wins horizontally

    expect(game.winner.value).toBe(1);
    expect(game.boardLocked.value).toBe(true);

    game.undo();
    expect(game.winner.value).toBeNull();
    expect(game.boardLocked.value).toBe(false);
    expect(game.currentPlayer.value).toBe(1);
    expect(game.board.value[0][4]).toBe(0);
  });

  it('prevents new moves after a victory until undo or restart', () => {
    const game = useGomokuGame(5);

    game.placeStone(0, 0);
    game.placeStone(1, 0);
    game.placeStone(0, 1);
    game.placeStone(1, 1);
    game.placeStone(0, 2);
    game.placeStone(1, 2);
    game.placeStone(0, 3);
    game.placeStone(1, 3);
    game.placeStone(0, 4); // player 1 wins

    const stonesAfterWin = game.board.value.flat().filter((cell) => cell !== 0).length;

    game.placeStone(2, 2); // should be ignored because game is locked

    const stonesAfterAttempt = game.board.value.flat().filter((cell) => cell !== 0).length;
    expect(stonesAfterAttempt).toBe(stonesAfterWin);
  });
});
