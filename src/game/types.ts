import { COLUMN_COUNT, ROW_COUNT } from './constants';

export type TileStatus = 'empty' | 'absent' | 'present' | 'correct';

export type Letter = string;

export type GuessRow = Letter[];

export type Board = GuessRow[];

export type KeyboardStatus = Partial<Record<string, Exclude<TileStatus, 'empty'>>>;

export type GuessNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type GuessDistribution = Record<GuessNumber, number>;

export interface GameStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: GuessDistribution;
}

export const guessNumbers = [1, 2, 3, 4, 5, 6] as const satisfies GuessNumber[];

export const createEmptyBoard = (): Board =>
  Array.from({ length: ROW_COUNT }, () => Array(COLUMN_COUNT).fill(''));

export const createEmptyGuessDistribution = (): GuessDistribution => ({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
});

export const createEmptyStats = (): GameStats => ({
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: createEmptyGuessDistribution(),
});
