export const ROW_COUNT = 6;
export const COLUMN_COUNT = 5;

export const MESSAGES = {
  notEnoughLetters: 'Not enough letters',
  notInWordList: 'Not in word list',
  endGame: ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'],
} as const;

export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
] as const;

export const STORAGE_KEYS = {
  completedWords: 'completedWords',
  stats: 'wordupStats',
  legacyGameCount: 'gameCount',
  legacyWinCount: 'streakCount',
  legacyGuessDistribution: 'guessDistribution',
} as const;
