export const BOARD_SIZE = 15 as const;

export type CellState = 0 | 1 | 2;
export type Player = 1 | 2;

export interface Point {
  row: number;
  col: number;
}

export interface Move extends Point {
  player: Player;
}

export type Board = CellState[][];

export interface WinningInfo {
  winner: Player;
  line: Point[];
}

export type GameOutcome = 'playing' | 'draw' | 'win';

export const PLAYER_NAMES: Record<Player, string> = {
  1: 'Black',
  2: 'White',
};
